

export default function Box({direction="row", raised=true, span=false, children})
{
  //TODO: "stack" children on top of each other?
  
  const style =
  {
    padding: raised ? "12px" : "0px",
    display: "flex",
    gap: "8px",
    flexDirection: direction,
    flex: 1,
    flexGrow: span ? 1 : 0,
    margin: raised ? "12px" : "0px",
    whiteSpace: "nowrap",
    borderRadius: "12px",
    border: raised ? "1px solid #f0f0f0" : null,
    boxShadow: raised ? "rgba(0, 0, 0, 0.2) 2px 2px 6px 0px" : null,
    background: raised ? "linear-gradient(145deg, #f0f0f0, #eeeeee)" : null,
    // background: raised ? "linear-gradient(145deg, #ffe9c2, #eec2ff)" : null,
    // background: raised ? "linear-gradient(145deg, #faeecf, #f4e1fc)" : null,
    // background: raised ? "linear-gradient(145deg, #fff3de, #f9f2ff)" : null,
    // background: raised ? "linear-gradient(145deg, #e0e3ff, #dedede)" : null,
  }
  
  return (
    <>
      <div style={style}>
        {children}
      </div>
    </>
  )
}