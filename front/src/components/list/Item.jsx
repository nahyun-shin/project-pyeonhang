import React, { useEffect } from "react";
import wishiIcon from "../../assets/img/wish.svg";
import wishiActiveIcon from "../../assets/img/wish_active.svg";
import styles from "@/components/list/item.module.css";
import { Link } from "react-router";
import EventIcon from "../icon/EventIcon";
import StoreIcon from "../icon/StoreIcon";
import { authStore } from "../../store/authStore";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useWish } from "../../hooks/useWish";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import empty from "../../assets/img/emptyLogo.png";
import ImgFallback from "../imgFall/imgFallback";

function Item({ product }) {
  const isAuth = authStore().isAuthenticated();  // boolean
  const role = authStore().userRole;
  const queryClient = useQueryClient();
  const { toggleWishMutation, isWish } = useWish();
  
  if (!product) return null;

    const handleWishClick = (e) => {
      e.preventDefault();
      if (!isAuth) {
        toast.warning("로그인 후 찜해주세요!");
        return;
      }
      else if (role === "ROLE_ADMIN") {
        toast.warning("관리자는 찜 기능을 이용할 수 없습니다.");
        return;
      }
      if (toggleWishMutation.isLoading) return; // 중복 클릭 방지
      toggleWishMutation.mutate(product);
    };
  

  return (
    <Link
      to={`/product/${product.sourceChain}/${product.promoType}/${product.productType}/${product.crawlId}`}
    >
      <div className={styles.prd_item}>
        <div className={styles.img_box}>
          <EventIcon
            product={product}
            cssPosition="absolute"
            top="15px"
            left="15px"
          />
          <StoreIcon product={product.sourceChain} 
            cssPosition="absolute"
            top="15px"
            right="15px"
            width="50px"
            height="50px"
          />
          {/* 상품 이미지 */}
          <ImgFallback
            src={product.imageUrl}
            alt={product.productName}
            className={styles.prd_img}
          />
          {/* 찜 버튼 */}
          <button
            type="button"
            className={styles.wish_btn}
            onClick={handleWishClick}
          >
            <img src={isWish(product.crawlId) ? wishiActiveIcon : wishiIcon} alt="" />
          </button>
        </div>
        <div className={styles.info_box}>
          {/* <StoreIcon product={product.sourceChain} /> */}
          <p className={styles.title}>{product.productName}</p>
          <p className={styles.price}>{product.price.toLocaleString()}원</p>
        </div>
      </div>
    </Link>
  );
}

export default Item;
