import "./loading.scss";
import { useEffect, useRef } from "react";

const Loading = () => {
  const loading = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);

  useEffect(() => {
    // let isLoading = false;

    // const path = document.querySelector(".path");
    // const loading = document.querySelector(".loading");

    setTimeout(() => {
      document.documentElement.style.setProperty("--stroke-dasharray", "0");
      loading?.current?.animate(
        {
          background: "transparent",
        },
        {
          fill: "forwards",
          duration: 2000,
          iterations: 1,
        }
      );

      path?.current?.animate(
        {
          stroke: "transparent",
        },
        {
          fill: "forwards",
          duration: 200,
          iterations: 1,
        }
      );
    }, 5000);
  }, []);

  return (
    <div className="loading" ref={loading}>
      <svg
        width="29"
        height="24"
        viewBox="0 0 29 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="path"
          d="M14.3564 0L28.2128 24H0.5L14.3564 0Z"
          ref={path}
        />
        <defs>
          <linearGradient
            id="paint0_linear_742_347"
            x1="3.35641"
            y1="18"
            x2="25.8564"
            y2="18"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#E5B1EE" />
            <stop offset="0.517791" stop-color="#D9D9D9" />
            <stop offset="0.9999" stop-color="#57859C" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default Loading;
