import React, {
  useRef,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";
import PropTypes from "prop-types";
import { a, useSpring, useSprings } from "react-spring";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";

import sty from "./TransitionLayout.module.scss";

const TransitionLayout = ({
  mode,

  useTransitionLayoutDivContainer = true,
  target,
  isTrigger,
  handleIsTransitionStart,
  handleIsTransitionOver,
  className,
  children,
  Component,
}) => {
  const ref = useRef();
  let refTarget = useRef();
  const refMode = useRef(mode);
  const initialSpring = useMemo(
    () => ({
      x: 0,
      y: 0,
      scale: 1,
      transformOrigin: "center center",
      opacity: mode === "go" ? 1 : 0,
    }),
    [mode]
  );
  const [springProps, setSpring] = useSpring(() => initialSpring, []);

  useEffect(() => {
    refMode.current = mode;
    return () => {};
  }, [mode]);

  const MemoComponent = useMemo(
    () => Component && React.forwardRef(Component),
    [Component]
  );

  useEffect(() => {
    if (typeof target === "string") {
      refTarget.current = document.getElementById(target);
    } else {
      refTarget = target;
    }

    return () => {
      clearAllBodyScrollLocks();
    };
  }, [target]);

  const getPositions = useCallback(() => {
    const {
      width: fWidth,
      height: fHeight,
      left: fLeft,
      top: fTop,
    } = refTarget.current.getBoundingClientRect();

    const {
      width: tWidth,
      height: tHeight,
      left: tLeft,
      top: tTop,
    } = ref.current.getBoundingClientRect();

    return {
      x: fLeft - tLeft,
      y: fTop - tTop,
      scale: fWidth / tWidth,
    };
  }, []);

  const onSpringStart = useCallback(() => {
    disableBodyScroll();
    refTarget.current.style.opacity = "0";

    handleIsTransitionStart && handleIsTransitionStart();
  }, []);

  const onSpringDone = useCallback(() => {
    enableBodyScroll();
    if (refMode.current === "go") {
      refTarget.current.style.opacity = "1";
      ref.current.style.opacity = "0";
    }

    handleIsTransitionOver && handleIsTransitionOver();
  }, [handleIsTransitionOver]);

  useEffect(() => {
    if (isTrigger) {
      const positions = getPositions();
      const fromTo =
        refMode.current === "go"
          ? { from: initialSpring, to: positions }
          : { from: positions, to: initialSpring };

      fromTo.from = {
        ...fromTo.from,
        opacity: 1,
        transformOrigin: `${positions.x < 0 ? "left" : "right"} ${
          positions.y < 0 ? "top" : "bottom"
        }`,
      };
      fromTo.to = { ...fromTo.to, opacity: 1 };

      setSpring({
        reset: true,
        onStart: onSpringStart,
        onRest: onSpringDone,
        ...fromTo,
      });
    }
    return () => {};
  }, [isTrigger, getPositions, initialSpring]);

  return useTransitionLayoutDivContainer ? (
    <a.div
      ref={ref}
      className={`${sty.TransitionLayout} ${className}`}
      style={springProps}
    >
      {children}
    </a.div>
  ) : MemoComponent ? (
    <MemoComponent ref={ref} className={className} />
  ) : (
    React.cloneElement(children, { ref, className })
  );
};

TransitionLayout.propTypes = {
  // mode: PropTypes.oneOf(["go", "back"]).isRequired, // storybook bug can't use oneOf
  useTransitionLayoutDivContainer: PropTypes.bool,
  target: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  handleIsTransitionStart: PropTypes.func,
  handleIsTriggerDone: PropTypes.func,
};

export default TransitionLayout;
