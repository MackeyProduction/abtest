<?php

namespace AppBundle\Controller;

use ABTest\Application\Models\ExperimentModel;
use ABTest\Application\Models\ExperimentNameModel;
use ABTest\DynamoDB\Interfaces\ITeaserConfig;
use ABTest\DynamoDB\Repositories\ExperimentGroupRepository;
use ABTest\DynamoDB\Repositories\ExperimentNameRepository;
use ABTest\DynamoDB\Repositories\ExperimentRepository;
use ABTest\DynamoDB\Repositories\TeaserConfigRepository;
use ABTest\DynamoDB\Repositories\TeaserContentRepository;
use ABTest\DynamoDB\Repositories\TeaserTrackingRepository;
use DateTime;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\Form;
use Symfony\Component\HttpFoundation\Request;

include "../vendor/abtest-api/autoload.php";

class DefaultController extends Controller
{
    /**
     * @Route("/", name="dashboard")
     */
    public function indexAction(Request $request)
    {
        $configRepository = new TeaserConfigRepository();

        return $this->render('abtest/index.html.twig', [
            'config' => $configRepository->getAll()->getCollection()->asArray(),
            'activeLink' => 'home-active',
        ]);
    }

    /**
     * @Route("/content", name="content")
     */
    public function contentAction(Request $request)
    {
        $contentRepository = new TeaserContentRepository();

        return $this->render('abtest/content.html.twig', [
            'content' => $contentRepository->getAll()->getCollection()->asArray(),
            'activeLink' => 'content-active',
        ]);
    }

    /**
     * @Route("/config", name="config")
     */
    public function configAction(Request $request)
    {
        $experimentGroupRepository = new ExperimentGroupRepository();
        $experimentNameRepository = new ExperimentNameRepository();
        $experimentRepository = new ExperimentRepository();
        $configRepository = new TeaserConfigRepository();
        $contentRepository = new TeaserContentRepository();

        $requestData = $request->request->all();

        if (!empty($requestData)) {
            $groupName = $requestData['expGroupName'];
            $experimentName = $requestData['expName'];
            $configId = $requestData['configId'];

            if ($groupName !== "" && $configId !== "") {
                if ($requestData['expGroupName-add'] !== "") {
                    $groupName = $requestData['expGroupName-add'];

                    // add group name to database
                    $experimentGroupRepository->addGroupNameExperiment(new ExperimentNameModel([
                        'name' => $requestData['expGroupName-add']
                    ]));
                }

                if ($requestData['expName-add'] !== "") {
                    $experimentName = $requestData['expName-add'];

                    // add experiment name to database
                    $experimentNameRepository->addNameExperiment(new ExperimentNameModel([
                        'name' => $requestData['expName-add']
                    ]));
                }

                // fetch data
                $groupId = $experimentGroupRepository->getByName($groupName)->getId();
                $expNameId = $experimentNameRepository->getByName($experimentName)->getId();

                // push to database
                $experimentRepository->addExperiment(new ExperimentModel([
                    'expGroupId' => $groupId,
                    'expNameId' => $expNameId,
                    'configId' => $configId,
                ]));
            }
        }

        return $this->render('abtest/config.html.twig', [
            'expGroups' => $experimentGroupRepository->getAll()->getCollection()->asArray(),
            'config' => $configRepository->getAll()->getCollection()->asArray(),
            'content' => $contentRepository->getAll()->getCollection()->asArray(),
            'activeLink' => 'config-active',
        ]);
    }

    /**
     * @Route("/track", name="track")
     */
    public function trackingAction(Request $request)
    {
        return $this->render('abtest/track.html.twig', [
            'activeLink' => 'track-active',
        ]);
    }

    /**
     * @Route("/daily-report", name="daily-report")
     */
    public function dailyReportAction(Request $request)
    {
        $currentDate = new DateTime();
        $currentDate = $currentDate->format("Y-m-d H:i:s");
        $split = explode(' ', $currentDate);
        $startDate = $split[0] . "%2000:00:00";
        $endDate = $split[0] . "%2023:59:00";

        $report = new TeaserConfigRepository();
        $content = new TeaserContentRepository();
        $tracking = new TeaserTrackingRepository();
        $variant = $this->getWinner($startDate, $endDate);

        return $this->render('abtest/daily-report.html.twig', [
            'report' => $report,
            'content' => $content,
            'tracking' => $tracking,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'variant' => $variant,
            'activeLink' => 'daily-report-active',
        ]);
    }

    /**
     * @Route("/monthly-report", name="monthly-report")
     */
    public function monthlyReportAction(Request $request)
    {
        $currentDate = new DateTime();
        $currentDate = $currentDate->format("Y-m");
        $startDate = $currentDate . "-01%2000:00:00";
        $endDate = $currentDate . "-31%2000:00:00";

        $report = new TeaserConfigRepository();
        $content = new TeaserContentRepository();
        $tracking = new TeaserTrackingRepository();
        $variant = $this->getWinner($startDate, $endDate);

        return $this->render('abtest/monthly-report.html.twig', [
            'report' => $report,
            'content' => $content,
            'tracking' => $tracking,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'variant' => $variant,
            'activeLink' => 'monthly-report-active',
        ]);
    }

    /**
     * @Route("/yearly-report", name="yearly-report")
     */
    public function yearlyReportAction(Request $request)
    {
        $currentDate = new DateTime();
        $currentDate = $currentDate->format("Y");
        $startDate = $currentDate . "-01-01%2000:00:00";
        $endDate = $currentDate . "-12-31%2000:00:00";

        $report = new TeaserConfigRepository();
        $content = new TeaserContentRepository();
        $tracking = new TeaserTrackingRepository();
        $variant = $this->getWinner($startDate, $endDate);

        return $this->render('abtest/yearly-report.html.twig', [
            'report' => $report,
            'content' => $content,
            'tracking' => $tracking,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'variant' => $variant,
            'activeLink' => 'yearly-report-active',
        ]);
    }

    public function getWinner($startDate, $endDate)
    {
        $variant = "";
        $report = new TeaserConfigRepository();

        for ($i = 0; $i < count($report->getByDateTime($startDate, $endDate)->getCollection()->asArray()); $i++) {
            $configId = $report->getByDateTime($startDate, $endDate)->getCollection()->asArray()[$i]->getConfigId();
            $winner = $report->compareContentIds($configId);
            $query = $report->getById($configId);

            if ($winner === $query->getContentId1()) {
                $variant[$i] = "A";
            } else {
                $variant[$i] = "B";
            }
        }

        return $variant;
    }
}
