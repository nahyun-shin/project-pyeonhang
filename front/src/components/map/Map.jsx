import React, { useEffect, useRef, useState, useCallback } from 'react';
import cuIcon from "../../assets/img/cu_icon.svg";
import gs25Icon from "../../assets/img/gs25_icon.svg";
import sevenIcon from "../../assets/img/seven_icon.svg";
import "@/components/map/map.css";
import CustomAlert from '../alert/CustomAlert';

const KAKAO_KEY = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;

function Map({ chainName, searchText = "", setList, selectedItem, height, showAlert = true, isDetailPage = false }) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [myLocation, setMyLocation] = useState(null);
  const mapInstance = useRef(null);
  const clustererRef = useRef(null);
  const currentInfowindow = useRef(null);
  const markersRef = useRef([]);
  const timerRef = useRef(null);

  const chainList = ["CU", "GS25", "세븐일레븐"];
  const chainIcon = [cuIcon, gs25Icon, sevenIcon];

  const setListRef = useRef(setList);
  useEffect(() => { setListRef.current = setList; }, [setList]);

  // [CSS 복구] 인포윈도우의 기본 스타일을 제거하고 커스텀 디자인을 입히는 함수
  const applyCustomStyle = useCallback(() => {
    const infoTitle = document.querySelectorAll('.info_marker');
    infoTitle.forEach(el => {
      const w = el.offsetWidth + 4;
      const parent = el.parentElement;
      // 카카오 기본 레이아웃 제거 및 위치 조정
      parent.style.width = w + 'px';
      parent.style.left = "50%";
      parent.style.transform = "translate(-50%, 0)";
      if (parent.previousSibling) parent.previousSibling.style.display = "none"; // 꼬리표 제거
      parent.parentElement.style.border = "0px";
      parent.parentElement.style.background = "unset";
      parent.parentElement.parentElement.style.border = "0px";
      parent.parentElement.parentElement.style.background = "unset";
    });
  }, []);

  // 1. 현재 위치 가져오기
  useEffect(() => {
    if (!navigator.geolocation) {
      setMyLocation({ latitude: 37.566826, longitude: 126.9786567 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setMyLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => setMyLocation({ latitude: 37.566826, longitude: 126.9786567 })
    );
  }, []);

  // 2. 마커 생성 및 인포윈도우 스타일 적용
  const createMarker = useCallback((place) => {
    if (!window.kakao?.maps) return null;
    let markerIcon = chainIcon[0];
    chainList.forEach((chain, index) => {
      if (place.place_name.includes(chain)) markerIcon = chainIcon[index];
    });

    const markerImage = new window.kakao.maps.MarkerImage(
      markerIcon, new window.kakao.maps.Size(34, 34), { offset: new window.kakao.maps.Point(17, 17) }
    );

    const marker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(place.y, place.x),
      image: markerImage,
      zIndex: 3 // 마커의 기본 zIndex 설정
    });

    const infowindow = new window.kakao.maps.InfoWindow({
      content: `<div class="info_marker"><p>${place.place_name}</p><span>${place.phone || ""}</span></div>`,
      zIndex: 10 // [핵심] 인포윈도우가 마커보다 항상 위에 오도록 높은 값 부여
    });

    window.kakao.maps.event.addListener(marker, "click", () => {
      if (currentInfowindow.current) currentInfowindow.current.close();
      mapInstance.current.panTo(marker.getPosition());
      infowindow.open(mapInstance.current, marker);
      currentInfowindow.current = infowindow;

      // 스타일 수정은 인포윈도우가 DOM에 렌더링된 직후에 실행
      setTimeout(applyCustomStyle, 50);
    });

    return marker;
  }, [applyCustomStyle]);

  // 3. 핵심 검색 함수 (정렬 포함)
  const performSearch = useCallback((targetLocation, isMove = false) => {
    // [추가] 상세 페이지 모드일 때는 드래그 재검색을 막음 (초기 로드 제외)
    if (isDetailPage && !isMove) return;

    if (!window.kakao?.maps?.services || !mapInstance.current) return;

    const ps = new window.kakao.maps.services.Places();
    const clusterer = clustererRef.current;
    const center = new window.kakao.maps.LatLng(targetLocation.latitude, targetLocation.longitude);

    const options = { 
        location: center, 
        radius: 5000, 
        sort: window.kakao.maps.services.SortBy.DISTANCE 
    };

    let allResults = [];
    let completed = 0;
    const targets = chainName === 'all' ? chainList : [chainName];

    targets.forEach(keyword => {
      ps.keywordSearch(keyword, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) allResults = [...allResults, ...data];
        completed++;

        if (completed === targets.length) {
          const filtered = allResults.filter((p, i, s) => s.findIndex(t => t.id === p.id) === i);
          markersRef.current.forEach(m => m.setMap(null));
          markersRef.current = [];
          if (clusterer) clusterer.clear();

          const newMarkers = filtered.map(place => createMarker(place)).filter(m => m !== null);
          markersRef.current = newMarkers;
          if (clusterer) clusterer.addMarkers(newMarkers);

          filtered.sort((a, b) => a.distance - b.distance);
          if (setListRef.current) setListRef.current(filtered);
          if (isMove) mapInstance.current.setCenter(center);
        }
      }, options);
    });
  }, [chainName, createMarker, isDetailPage]);

  // 4. 지도 초기화 및 드래그 멈춤 이벤트 (디바운스 0.5초)
  useEffect(() => {
    if (!myLocation || mapInstance.current) return;

    const initMap = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const map = new window.kakao.maps.Map(container, {
          center: new window.kakao.maps.LatLng(myLocation.latitude, myLocation.longitude),
          level: 4,
        });
        mapInstance.current = map;

        clustererRef.current = new window.kakao.maps.MarkerClusterer({
          map, averageCenter: true, minLevel: 10,
        });

        window.kakao.maps.event.addListener(map, 'idle', () => {
          // [추가] 상세 페이지일 때는 드래그가 끝나도 재검색하지 않음
          if (isDetailPage) return;

          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => {
            const center = map.getCenter();
            performSearch({ latitude: center.getLat(), longitude: center.getLng() }, false);
          }, 150);
        });

        setMapLoaded(true);
        performSearch(myLocation, true);
      });
    };

    if (window.kakao?.maps) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&autoload=false&libraries=services,clusterer`;
      script.async = true;
      document.head.appendChild(script);
      script.onload = initMap;
    }
  }, [myLocation, performSearch, isDetailPage]);

  // 5. 브랜드 변경 시 즉시 업데이트
  useEffect(() => {
    if (mapLoaded && mapInstance.current) {
        const center = mapInstance.current.getCenter();
        performSearch({ latitude: center.getLat(), longitude: center.getLng() }, false);
    }
  }, [chainName, mapLoaded, performSearch]);

  // 6. 검색어 처리 (주소 검색 실패 시 키워드 검색 시도)
  useEffect(() => {
    if (!mapLoaded || !searchText.trim() || !window.kakao?.maps?.services) return;

    const geocoder = new window.kakao.maps.services.Geocoder();
    const ps = new window.kakao.maps.services.Places();

    // 1단계: 주소로 먼저 검색 (예: 서울시 강남구)
    geocoder.addressSearch(searchText, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        // 주소 검색 성공 시
        performSearch({ latitude: result[0].y, longitude: result[0].x }, true);
      } else {
        // 2단계: 주소 검색 실패 시 키워드로 검색 (예: 강남역, 코엑스 등)
        ps.keywordSearch(searchText, (data, status) => {
          if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
            // 키워드 검색 성공 시 첫 번째 결과 좌표 사용
            performSearch({ latitude: data[0].y, longitude: data[0].x }, true);
          } else if (showAlert) {
            CustomAlert({ text: "검색 결과를 찾을 수 없습니다." });
          }
        });
      }
    });
  }, [searchText, mapLoaded, performSearch, showAlert]);

  // 7. 사이드바 아이템 선택 시 이동 및 표시
  useEffect(() => {
    if (!mapInstance.current || !selectedItem || !window.kakao?.maps) return;

    const map = mapInstance.current;
    const moveLatLng = new window.kakao.maps.LatLng(selectedItem.y, selectedItem.x);

    map.setCenter(moveLatLng); 

    let targetMarker = markersRef.current.find(m => {
      const pos = m.getPosition();
      return Math.abs(pos.getLat() - parseFloat(selectedItem.y)) < 0.0001 &&
             Math.abs(pos.getLng() - parseFloat(selectedItem.x)) < 0.0001;
    });

    if (!targetMarker) {
      targetMarker = createMarker(selectedItem);
      targetMarker.setMap(map);
    }

    // 마커가 지도 레이어에 완전히 등록된 후 이벤트를 발생시킵니다.
    // 딜레이를 300ms로 조금 더 늘려 안정성을 확보합니다.
    setTimeout(() => {
        if (targetMarker) {
            window.kakao.maps.event.trigger(targetMarker, 'click');
        }
    }, 300);

  }, [selectedItem, createMarker]);

  return <div id="map" style={{ width: "100%", height: height, background: "#eee" }} />;
}

export default Map;