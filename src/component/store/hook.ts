/* eslint-disable @typescript-eslint/no-explicit-any */

import { useContext, useEffect } from "react"
import { StoreContext } from "./context"
import { KAKAO_SDK_JS_KEY, NAVER_MAP_CLIENT_ID } from "../../env"

const baseUrl = import.meta.env.BASE_URL

// 네이버 지도 및 카카오 SDK를 로드하기 위한 외부 스크립트 URL
const NAVER_MAP_URL = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}`
const KAKAO_SDK_URL = `${baseUrl}/kakao_js_sdk/2.7.1/kakao.min.js`

/**
 * 네이버 지도 SDK를 로드하고 사용할 수 있게 해주는 Hook입니다.
 *
 * @returns {any} 네이버 지도 SDK 객체 (로딩 전에는 null)
 */
export const useNaver = () => {
  const { naver, setNaver } = useContext(StoreContext)
  useEffect(() => {
    // 클라이언트 ID가 없으면 중단
    if (!NAVER_MAP_CLIENT_ID) {
      return
    }

    // 스크립트가 아직 로드되지 않았으면 동적으로 추가
    if (!document.querySelector(`script[src="${NAVER_MAP_URL}"]`)) {
      const script = document.createElement("script")
      script.src = NAVER_MAP_URL
      document.head.appendChild(script)
      script.addEventListener("load", () => {
        setNaver((window as any).naver)
      })
    }
  }, [setNaver])

  return naver
}

/**
 * 카카오 SDK를 로드하고 사용할 수 있게 해주는 Hook입니다.
 *
 * @returns {any} 카카오 SDK 객체 (로딩 전에는 null)
 */

const KAKAO_SDK_JS_KEY = "f64a0349fea689f595467438669ec10d";

export const useKakao = () => {
  const { kakao, setKakao } = useContext(StoreContext)

  useEffect(() => {
    // 1. SDK 키가 없으면 중단 (배포 환경 변수 체크용)
    if (!KAKAO_SDK_JS_KEY) {
      console.warn("Kakao SDK Key가 존재하지 않습니다. 환경 변수를 확인해주세요.");
      return
    }

    // 초기화를 안전하게 실행하는 내부 함수 (setTimeout으로 전역 객체 매핑 타이밍 보장)
    const initKakao = () => {
      setTimeout(() => {
        const KakaoInstance = (window as any).Kakao
        if (KakaoInstance) {
          if (!KakaoInstance.isInitialized()) {
            KakaoInstance.init(KAKAO_SDK_JS_KEY)
          }
          setKakao(KakaoInstance)
        }
      }, 100)
    }

    // 2. 이미 window에 Kakao 객체가 존재하고 초기화까지 끝났다면 상태만 갱신
    if ((window as any).Kakao && (window as any).Kakao.isInitialized()) {
      setKakao((window as any).Kakao)
      return
    }

    // 3. 스크립트 태그가 이미 존재한다면 바로 초기화 시도
    if (document.querySelector(`script[src="${KAKAO_SDK_URL}"]`)) {
      if ((window as any).Kakao) {
        initKakao()
      } else {
        const existingScript = document.querySelector(`script[src="${KAKAO_SDK_URL}"]`)
        existingScript?.addEventListener("load", initKakao)
      }
      return
    }

    // 4. 스크립트가 아예 없을 때만 동적으로 추가
    const script = document.createElement("script")
    script.src = KAKAO_SDK_URL
    script.async = true
    script.addEventListener("load", initKakao)
    document.head.appendChild(script)

    return () => {
      script.removeEventListener("load", initKakao)
    }
  }, [setKakao])

  return kakao
}