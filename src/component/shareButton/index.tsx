import {
  BRIDE_FULLNAME,
  GROOM_FULLNAME,
  LOCATION,
  SHARE_ADDRESS,
  SHARE_ADDRESS_TITLE,
  WEDDING_DATE,
  WEDDING_DATE_FORMAT,
} from "../../const"
import ktalkIcon from "../../icons/ktalk-icon.png"
import { LazyDiv } from "../lazyDiv"
import { useKakao } from "../store"

const baseUrl = import.meta.env.BASE_URL

/**
 * 카카오톡으로 초대장을 공유할 수 있는 버튼 컴포넌트입니다.
 *
 * @returns {JSX.Element} 공유 버튼 섹션
 */
export const ShareButton = () => {
  const kakao = useKakao()

  /**
   * 중복 슬래시 없이 안전하게 절대 경로 URL을 생성하는 함수
   * @param {string} path - 하위 파일 경로 (예: "preview_image.png")
   * @returns {string} 완성된 절대 경로 URL
   */
  const getAbsoluteUrl = (path = "") => {
    const origin = window.location.origin
    // baseUrl과 path를 매끄럽게 잇고, 연속된 슬래시(//)는 하나로 치환 (프로토콜 부분 제외)
    const combinedPath = `${baseUrl}/${path}`.replace(/\/+/g, "/")
    return `${origin}${combinedPath}`
  }

  return (
    <LazyDiv className="footer share-button">
      <button
        className="ktalk-share"
        onClick={() => {
          // 카카오 SDK가 아직 로드되지 않았거나 초기화 전이면 실행하지 않음
          if (!kakao) {
            console.warn("카카오 SDK가 아직 준비되지 않았습니다.")
            return
          }

          // 이동할 메인 주소와 카톡에 띄울 미리보기 이미지 주소 생성
          const targetUrl = getAbsoluteUrl()
          const previewImageUrl = getAbsoluteUrl("preview_image.png")

          // 카카오톡 공유 전송 (위치 기반 location 템플릿 사용)
          kakao.Share.sendDefault({
            objectType: "location",
            address: SHARE_ADDRESS,
            addressTitle: SHARE_ADDRESS_TITLE,
            content: {
              title: `${GROOM_FULLNAME} ❤️ ${BRIDE_FULLNAME}의 결혼식에 초대합니다.`,
              description:
                WEDDING_DATE.format(WEDDING_DATE_FORMAT) + "\n" + LOCATION,
              imageUrl: previewImageUrl, // ⭕ 슬래시가 꼬이지 않은 깔끔한 이미지 URL
              link: {
                mobileWebUrl: targetUrl, // ⭕ 이미지 클릭 시 이동할 정확한 깃허브 주소
                webUrl: targetUrl,
              },
            },
            buttons: [
              {
                title: "초대장 보기",
                link: {
                  mobileWebUrl: targetUrl, // ⭕ 버튼 클릭 시 이동할 정확한 깃허브 주소
                  webUrl: targetUrl,
                },
              },
            ],
          })
        }}
      >
        <img src={ktalkIcon} alt="ktalk-icon" /> 카카오톡으로 공유하기
      </button>
    </LazyDiv>
  )
}