import React, {
  useRef,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";
import sty from "./test.module.scss";
import img from "./LupinIIIS1Ep21scene.webp";

import TransitionLayout from "./TransitionLayout.jsx";

export default {
  title: "Example/TransitionLayout",
  component: TransitionLayout,
  argTypes: {
    // backgroundColor: { control: "color" },
  },
};

const TestComp = ({ className, testRef, ...restProps }, ref) => {
  return (
    <img className={className} ref={testRef} src={img} alt="" {...restProps} />
  );
};

const Template = (args) => {
  const refTarget = useRef();
  const [isTrigger, setIsTrigger] = useState(false);
  const toggleTrigger = useCallback(() => {
    setIsTrigger((prev) => (!prev ? true : false));
  }, []);

  const handleIsTriggerDone = useCallback(() => {
    setIsTrigger(false);
  }, []);

  return (
    <>
      <TransitionLayout
        mode="go"
        test2="123"
        target={refTarget}
        isTrigger={isTrigger}
        className={sty.TransitionLayout}
        handleIsTriggerDone={handleIsTriggerDone}
        {...args}
      >
        <TestComp className={sty.img} />
      </TransitionLayout>
      <TestComp testRef={refTarget} className={sty.img__target} />
      <button onClick={toggleTrigger}>toggleTrigger</button>
    </>
  );
};

export const Primary = Template.bind({});

Primary.args = {
  // primary: true,
  // label: "Button",
};
