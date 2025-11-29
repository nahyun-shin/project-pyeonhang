export const CHAIN_MAP = {
  SEV: '7ELEVEN',
  GS25: 'GS25',
  CU: 'CU',
};

// 데이터 변환 함수
export function mapChainName(chainCode) {
  return CHAIN_MAP[chainCode] || chainCode;
}
//날짜변환
export const formatDate = (isoString) => {
  const date = new Date(isoString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0'); 
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy} . ${mm} . ${dd}`;
};