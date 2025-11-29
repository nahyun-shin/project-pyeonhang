import React, { useEffect, useRef, useState } from 'react';
import cuIcon from "../../assets/img/cu_icon.svg";
import gs25Icon from "../../assets/img/gs25_icon.svg";
import sevenIcon from "../../assets/img/seven_icon.svg";
import "@/components/map/map.css";
import CustomAlert from '../alert/CustomAlert';

const KAKAO_KEY = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;

function Map({ chainName, searchText = "", setList, selectedItem, height, showAlert = true }) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [myLocation, setMyLocation] = useState({});
  const mapInstance = useRef(null);
  const clustererRef = useRef(null);
  const currentInfowindow = useRef(null);

  const chainList = ["CU", "GS25", "세븐일레븐"];
  const chainIcon = [cuIcon, gs25Icon, sevenIcon];

  const markersRef = useRef([]);

  // 현재 위치 가져오기
  useEffect(() => {
    if (!navigator.geolocation) {
      CustomAlert({ text: '위치 정보를 지원하지 않는 브라우저입니다.' });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMyLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        // 위치 권한 없으면 기본값
        setMyLocation({ latitude: 33.450701, longitude: 126.570667 });
      }
    );
  }, []);

  // Kakao 지도 SDK 로드 및 초기화
  useEffect(() => {
    if (!myLocation.latitude || !myLocation.longitude || mapInstance.current) return;

    if (window.kakao && window.kakao.maps) {
      initMap();
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&autoload=false&libraries=services,clusterer`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => initMap());
    };

    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, [myLocation]);

  const initMap = () => {
    const container = document.getElementById("map");
    const options = {
      center: new window.kakao.maps.LatLng(myLocation.latitude, myLocation.longitude),
      level: 4,
    };
    const map = new window.kakao.maps.Map(container, options);
    mapInstance.current = map;

    clustererRef.current = new window.kakao.maps.MarkerClusterer({
      map,
      averageCenter: true,
      minLevel: 10,
    });

    setMapLoaded(true);
  };

  // 마커 생성
  const createMarker = (place) => {
    // place_name 기준으로 아이콘 선택
    let markerIcon = '';
    chainList.forEach((chain, index) => {
      if (place.place_name.includes(chain)) {
        markerIcon = chainIcon[index];
      }
    });

    const markerImage = new window.kakao.maps.MarkerImage(
      markerIcon,
      new window.kakao.maps.Size(34, 34),
      { offset: new window.kakao.maps.Point(17, 17) }
    );

    const marker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(place.y, place.x),
      image: markerImage,
    });

    const infowindow = new window.kakao.maps.InfoWindow({
      content: `<div class="info_marker"><p>${place.place_name}</p><span>${place.phone || ""}</span></div>`,
    });

    window.kakao.maps.event.addListener(marker, "click", () => {
      if (currentInfowindow.current) currentInfowindow.current.close();

      infowindow.open(mapInstance.current, marker);
      currentInfowindow.current = infowindow;

      const infoTitle = document.querySelectorAll('.info_marker');
      infoTitle.forEach(el => {
        const w = el.offsetWidth + 4;
        const originWidth = el.parentElement.dataset.width || w + 'px';
        el.parentElement.dataset.width = originWidth;
        el.parentElement.style.width = originWidth;
        el.parentElement.style.left = "50%";
        el.parentElement.style.transform = "translate(-50%, 0)";
        el.parentElement.previousSibling.style.display = "none";
        el.parentElement.parentElement.style.border = "0px";
        el.parentElement.parentElement.style.background = "unset";
      });
    });

    markersRef.current.push(marker);
    return marker;
  };

  // 검색 및 마커 표시
// 검색 및 마커 표시
useEffect(() => {
  if (!mapLoaded || !window.kakao || !mapInstance.current) return;

  const ps = new window.kakao.maps.services.Places();
  const geocoder = new window.kakao.maps.services.Geocoder(); // 주소-좌표 변환 추가
  const clusterer = clustererRef.current;

  // 이전 마커 제거
  markersRef.current.forEach(m => m.setMap(null));
  markersRef.current = [];
  if (clusterer) clusterer.clear();

  // searchText가 있으면 해당 위치로 검색, 없으면 현재 위치
  const performSearch = (searchLocation) => {
    const options = {
      location: new window.kakao.maps.LatLng(searchLocation.latitude, searchLocation.longitude),
      radius: 8500,
    };

    let allResults = [];
    let completedSearches = 0;

    const searchService = (data, status, pagination) => {
      if (status === window.kakao.maps.services.Status.OK) {
        allResults = allResults.concat(data);
      }

      completedSearches++;

      // 모든 검색이 완료되면
      if (completedSearches === (chainName === 'all' ? chainList.length : 1)) {
        if (allResults.length === 0 && showAlert) {
          CustomAlert({ text: "검색 결과가 없습니다." });
          return;
        }

        console.log("전체 검색 결과:", allResults);

        // 중복 제거 (같은 place_id 기준)
        const filtered = allResults.filter((place, index, self) =>
          index === self.findIndex(p => p.id === place.id)
        );

        // 마커 생성
        filtered.forEach(place => createMarker(place));
        clusterer.addMarkers(markersRef.current);

        // 거리순 정렬
        filtered.sort((a, b) => a.distance - b.distance);

        setList && setList(filtered);

        // 지도 중심 이동
        mapInstance.current.setCenter(
          new window.kakao.maps.LatLng(searchLocation.latitude, searchLocation.longitude)
        );
      }
    };

    // 체인별로 키워드 검색
    if (chainName === 'all') {
      chainList.forEach(chain => {
        ps.keywordSearch(chain, searchService, options);
      });
    } else {
      ps.keywordSearch(chainName, searchService, options);
    }
  };

  // searchText가 있으면 해당 위치의 좌표를 먼저 가져옴
  if (searchText.trim()) {
    geocoder.addressSearch(searchText, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        // 주소 검색 성공
        const searchLocation = {
          latitude: result[0].y,
          longitude: result[0].x,
        };
        performSearch(searchLocation);
      } else {
        // 주소 검색 실패 시 장소명으로 재검색
        ps.keywordSearch(searchText, (data, status) => {
          if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
            const searchLocation = {
              latitude: data[0].y,
              longitude: data[0].x,
            };
            performSearch(searchLocation);
          } else {
            // 검색 실패 시 현재 위치 사용
            if (showAlert) {
              CustomAlert({ text: "검색한 위치를 찾을 수 없습니다. 현재 위치로 검색합니다." });
            }
            performSearch(myLocation);
          }
        });
      }
    });
  } else {
    // searchText가 없으면 현재 위치로 검색
    performSearch(myLocation);
  }

  if (currentInfowindow.current) currentInfowindow.current.close();

}, [mapLoaded, searchText, chainName]);

  // 선택한 편의점 클릭 시 지도 이동
  useEffect(() => {
    if (!mapInstance.current || !selectedItem) return;

    const newCenter = new window.kakao.maps.LatLng(selectedItem.y, selectedItem.x);
    mapInstance.current.setCenter(newCenter);

    const marker = createMarker(selectedItem);
    window.kakao.maps.event.trigger(marker, 'click');
  }, [selectedItem]);

  return <div id="map" style={{ width: "100%", height: height }} />;
}

export default Map;