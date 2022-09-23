import { useMouse } from 'ahooks';
import type { FC } from 'react';
import useMeasure from 'react-use-measure';

import gumball from '../assets/gumball.png';
import './app.scss';

const getAngle = (cx: number, cy: number, ex: number, ey: number) => {
  const dy = ey - cy;
  const dx = ex - cx;
  const theta = Math.atan2(dy, dx);
  return (theta * 180) / Math.PI;
};

const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
  const xDistance = x2 - x1;
  const yDistance = y2 - y1;
  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
};

const leftOffsetX = 0.3;
const leftOffsetY = 0.27;
const rightOffsetX = 0.55;
const rightOffsetY = 0.17;

const App: FC = () => {
  const [ref, bounds] = useMeasure();
  const { pageX, pageY } = useMouse();

  const eyeRadius = bounds.height / 100;
  const maxDistance = bounds.height / 20;

  const initLeftX = eyeRadius + bounds.left + leftOffsetX * bounds?.width!;
  const initLeftY = eyeRadius + bounds.top + leftOffsetY * bounds?.height!;
  const initRightX = eyeRadius + bounds.left + rightOffsetX * bounds?.width!;
  const initRightY = eyeRadius + bounds.top + rightOffsetY * bounds?.height!;

  const leftAngle = getAngle(pageX, pageY, initLeftX, initLeftY);
  const rightAngle = getAngle(pageX, pageY, initRightX, initRightY);

  const leftDistance = getDistance(pageX, pageY, initLeftX, initLeftY);
  const rightDistance = getDistance(pageX, pageY, initRightX, initRightY);

  const dynamicShiftLeft = Math.min(
    10000 / leftDistance,
    leftDistance,
    maxDistance
  );
  const dynamicShiftRight = Math.min(
    10000 / rightDistance,
    rightDistance,
    maxDistance
  );

  return (
    <div className="app">
      <div ref={ref} className="container">
        <img className="gumball" src={gumball} alt="Gumball" />
        <div
          className="eye eye--left"
          style={{
            left: leftOffsetX * 100 + '%',
            top: leftOffsetY * 100 + '%',
            width: eyeRadius * 2 + 'px',
            height: eyeRadius * 2 + 'px',
            translate: `
						${-Math.cos((leftAngle * Math.PI) / 180) * dynamicShiftLeft}px
						${-Math.sin((leftAngle * Math.PI) / 180) * dynamicShiftLeft}px`,
            scale: `${Math.max(1, Math.min(2, 100 / leftDistance))}`,
          }}
        />
        <div
          className="eye eye--right"
          style={{
            left: rightOffsetX * 100 + '%',
            top: rightOffsetY * 100 + '%',
            width: eyeRadius * 2 + 'px',
            height: eyeRadius * 2 + 'px',
            translate: `
						${-Math.cos((rightAngle * Math.PI) / 180) * dynamicShiftRight}px
						${-Math.sin((rightAngle * Math.PI) / 180) * dynamicShiftRight}px`,
            scale: `${Math.max(1, Math.min(2, 100 / rightDistance))}`,
          }}
        />
      </div>
    </div>
  );
};

export default App;
