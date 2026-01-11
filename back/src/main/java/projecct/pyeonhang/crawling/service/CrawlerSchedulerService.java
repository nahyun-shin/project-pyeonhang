package projecct.pyeonhang.crawling.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // 로그를 위해 추가
import org.springframework.stereotype.Service;
import projecct.pyeonhang.crawling.crawler.CUCrawler;
import projecct.pyeonhang.crawling.crawler.GSCrawler;
import projecct.pyeonhang.crawling.crawler.SEVCrwaler;

@Slf4j // 로그 기능을 활성화합니다
@Service
@RequiredArgsConstructor
public class CrawlerSchedulerService {

    private final CUCrawler cuCrawler;
    private final GSCrawler gsCrawler;
    private final SEVCrwaler sevCrwaler;

    public void crawlAllConvenienceStoresMonthly() {
        log.info("========== 월간 편의점 크롤링 통합 프로세스 시작 ==========");

        // 1. GS25 크롤링
        try {
            log.info("[Crawler STEP 1] GS25 시작");
            gsCrawler.crawlMonthlyEvents();
            log.info("[Crawler STEP 1] GS25 완료");
        } catch (Exception e) {
            log.error("[Crawler ERROR] GS25 크롤링 중 오류 발생: {}", e.getMessage());
            e.printStackTrace();
        }

        //2. CU 크롤링
        try {
            log.info("[Crawler STEP 2] CU 시작");
            cuCrawler.crawlMonthlyEvents();
            log.info("[Crawler STEP 2] CU 완료");
        } catch (Exception e) {
            log.error("[Crawler ERROR] CU 크롤링 중 오류 발생: {}", e.getMessage());
            e.printStackTrace();
        }

        //3. 세븐일레븐 크롤링
        try {
            log.info("[Crawler STEP 3] 세븐일레븐 시작");
            sevCrwaler.crawlMonthlyEvents();
            log.info("[Crawler STEP 3] 세븐일레븐 완료");
        } catch (Exception e) {
            log.error("[Crawler ERROR] 세븐일레븐 크롤링 중 오류 발생: {}", e.getMessage());
            e.printStackTrace();
        }

        log.info("========== 모든 편의점 크롤링 프로세스 종료 ==========");
    }
}