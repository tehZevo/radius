import {useEffect, useState} from "react"
import Slider, { Range } from 'rc-slider'
import 'rc-slider/assets/index.css';

import Box from "../box"
import * as R from "../../services/radius"
import {useClientRadius} from "../../hooks/radiusHooks"

export default function RadiusSlider() {
  const [radius, setRadius] = useState([0, 0])
  
  // const radius = useClientRadius(0)
  //TODO: figure out why we cant set slider default value from server
  function setRadiusFromSlider(value)
  {
    //TODO: support minRadius
    R.setRadius(value[1])
  }
  
  async function fetchRadius()
  {
    const radius = await R.getRadius()
    setRadius([0, radius])
  }
  
  useEffect(() =>
  {
    fetchRadius()
  }, [])
  
  function onChange(value)
  {
    // setRadius(value)
  }
  
  return (
    <Box>
      <div style={{width:"200px"}}>
        <Slider
          range
          min={0}
          max={5}
          step={1}
          allowCross={false}
          draggableTrack={true}
          dots={true}
          defaultValue={radius}
          onChange={onChange}
          onChangeComplete={setRadiusFromSlider}
      />
      </div>
    </Box>
  );
}
