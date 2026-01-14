package projecct.pyeonhang.crawling.scheduler;


import lombok.RequiredArgsConstructor;

import org.springframework.boot.CommandLineRunner;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import projecct.pyeonhang.crawling.service.CrawlerSchedulerService;

@Component
@RequiredArgsConstructor
public class CrawlerScheduler implements CommandLineRunner{

    private final CrawlerSchedulerService crawlerSchedulerService;

    // [방아쇠 1] 서버가 켜질 때 실행 (일회성/체크용)
    @Override
    public void run(String... args) {
        // 배포 전 로컬에서 딱 한 번 실행하고 싶을 때만 아래 주석을 풉니다.
        // 실행 후 데이터가 들어오면 다시 주석처리하고 배포하면 됩니다.
        
        // crawlerSchedulerService.crawlAllConvenienceStoresMonthly(); 
        
        // System.out.println("[시스템] 서버 시작됨 - 스케줄러 대기 중");
    }

    // [방아쇠 2] 매월 1일 새벽 3시 실행 (유지보수용 자동화)
    @Scheduled(cron = "0 0 3 1 * *", zone = "Asia/Seoul")
    public void monthlyCrawlingJob() {
        System.out.println("매월 1일 편의점 3사 데이터 크롤링 시작");
        crawlerSchedulerService.crawlAllConvenienceStoresMonthly();
        System.out.println("크롤링 종료");
    }

}
// public class CrawlerScheduler implements org.springframework.boot.CommandLineRunner {

//     private final CrawlerSchedulerService crawlerSchedulerService;
//     private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate; // DB 확인용 추가

//     // 정기 스케줄: 매월 1일 새벽 3시
//     @Scheduled(cron = "0 0 3 1 * *", zone = "Asia/Seoul")
//     public void monthlyCrawlingJob() {
//         runCrawling();
//     }

//     // 2. 서버가 켜질 때 자동으로 실행되는 메서드
//     @Override
//     public void run(String... args) {
//         // DB에 데이터가 하나라도 있는지 확인
//         Integer count = jdbcTemplate.queryForObject(
//                 "SELECT COUNT(*) FROM craw_product", Integer.class);

//         if (count == null || count == 0) {
//             System.out.println("[알림] DB가 비어있습니다. 초기 데이터를 수집합니다...");
//             runCrawling();
//         } else {
//             System.out.println("[알림] 기존 데이터(" + count + "건)가 존재합니다. 다음 정기 스케줄에 실행됩니다.");
//         }
//     }

//     // 공통 실행 로직을 별도 메서드로 분리
//     private void runCrawling() {
//         System.out.println("편의점 데이터 크롤링 프로세스 시작...");
//         crawlerSchedulerService.crawlAllConvenienceStoresMonthly();
//         System.out.println("크롤링 프로세스 종료");
//     }
// }
