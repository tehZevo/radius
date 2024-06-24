const DISTANCE_COLORS = [
  "#3d6eeb", //you (0)
  "#ccbe1f", //1st
  "#ababab", //2nd
  "#756029", //3rd+
]

const DISTANCE_ELEMS = [
  <span>You</span>,
  <span>1<sup>st</sup></span>,
  <span>2<sup>nd</sup></span>,
  <span>3<sup>rd</sup>+</span>
]

const UNKNOWN_COLOR = "#8f8b81"
const UNKNOWN_ELEM = <span>?</span>


export default function DistanceIcon({distance}) {
  const cappedDistance = distance == null ? distance : Math.min(distance, DISTANCE_ELEMS.length - 1)
  const color = cappedDistance == null ? UNKNOWN_COLOR : DISTANCE_COLORS[cappedDistance]
  const elem = cappedDistance == null ? UNKNOWN_ELEM : DISTANCE_ELEMS[cappedDistance]
  
  const style = {
    color: color,
    fontWeight: "bold",
  }
  
  return (
    <div style={style}>
      {elem}
    </div>
  );
}
