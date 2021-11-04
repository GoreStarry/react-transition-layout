import React, {
  useRef,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";
import PropTypes from "prop-types";
import { a, useSpring } from "react-spring";
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
  reactSpringConfig,
}) => {
  const ref = useRef();
  let refTarget = useRef();
  const refMode = useRef(mode);
  const initialSpring = useMemo(
    () => ({
      x: 0,
      y: 0,
      scale: 1,
      transformOrigin: "left top",
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
    if (target) {
      if (typeof target === "string") {
        refTarget.current = document.getElementById(target);
      } else {
        refTarget = target;
      }
    }

    return () => {
      clearAllBodyScrollLocks();
    };
  }, [target]);

  const getPositions = useCallback(() => {
    // console.log(refTarget.current);
    const {
      width: targetWidth,
      height: targetHeight,
      left: targetLeft,
      top: targetTop,
    } = refTarget.current.getBoundingClientRect();

    const {
      width: selfWidth,
      height: selfHeight,
      left: selfLeft,
      top: selfTop,
    } = ref.current.getBoundingClientRect();

    return {
      x: targetLeft - selfLeft,
      y: targetTop - selfTop,
      scale: targetWidth / selfWidth,
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

      // console.log(positions);

      const fromTo =
        refMode.current === "go"
          ? { from: initialSpring, to: positions }
          : { from: positions, to: initialSpring };

      fromTo.from = {
        ...fromTo.from,
        opacity: 1,
      };

      fromTo.to = {
        ...fromTo.to,
        opacity: 1,
      };

      setSpring({
        reset: true,
        onStart: onSpringStart,
        onRest: onSpringDone,
        ...fromTo,
        config: reactSpringConfig,
      });
    }
    return () => {};
  }, [isTrigger, initialSpring]);

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
  handleIsTransitionOver: PropTypes.func,
};

export default TransitionLayout;
