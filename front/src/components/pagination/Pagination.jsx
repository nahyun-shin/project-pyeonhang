import React, { useMemo } from 'react';
import styles from '@/components/pagination/pagination.module.css';

function Pagination({
  page,
  totalRows,
  movePage,
  pagePerRows = 10,
  blockPerCount = 10,
}) {

  const { totalPage, nowBlock, totalBlock } = useMemo(() => {
    if (!totalRows || !pagePerRows) return { totalPage: 0, nowBlock: 0, totalBlock: 0 };

    const totalPage = Math.ceil(totalRows / pagePerRows);
    const nowBlock = Math.floor((page ?? 0) / blockPerCount);
    const totalBlock = Math.ceil(totalPage / blockPerCount);

    return { totalPage, nowBlock, totalBlock };
  }, [totalRows, pagePerRows, page, blockPerCount]);

  if (totalPage === 0) return null;

  const renderPage = () => {
    const pageHTML = [];

    const pushItem = (key, label, targetPage, isDisabled = false, isActive = false) => {
      const itemClass = [
        styles.paginationItem,
        isDisabled ? styles.paginationItemDisabled : '',
        isActive ? styles.paginationItemActive : ''
      ].join(' ');

      pageHTML.push(
        <li key={key} className={itemClass}>
          <button
            className={styles.paginationLink}
            disabled={isDisabled}
            onClick={() => movePage(targetPage)}
          >
            {label}
          </button>
        </li>
      );
    };

    // 처음
    pushItem('first', '처음', 0, page === 0);

    // 이전 블록
    const prevBlockPage = (nowBlock * blockPerCount) - 1;
    pushItem('prev', '이전', prevBlockPage, nowBlock <= 0);

    // 페이지 번호
    for (let i = 0; i < blockPerCount; i++) {
      const pageNum = nowBlock * blockPerCount + i;
      if (pageNum >= totalPage) break;
      pushItem(pageNum, pageNum + 1, pageNum, false, pageNum === page);
    }

    // 다음 블록
    const nextBlockPageNum = (nowBlock + 1) * blockPerCount;
    pushItem('next', '다음', nextBlockPageNum, (nowBlock + 1) >= totalBlock);

    // 마지막 페이지
    const lastPageNum = totalPage - 1;
    pushItem('last', '마지막', lastPageNum, page >= totalPage - 1);

    return pageHTML;
  };

  return (
    <nav className={styles.paginationWrapper} aria-label="Page navigation">
      <ul className={styles.paginationList}>
        {renderPage()}
      </ul>
    </nav>
  );
}

export default Pagination;
