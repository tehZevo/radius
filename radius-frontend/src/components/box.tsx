

export default function Box({direction="row", raised=true, grow=0, children})
{
  //TODO: clean MUI/MDL shadow
  const style =
  {
    backgroundColor: "white",
    padding: raised ? "12px" : "0px",
    display: "flex",
    gap: "8px",
    flexDirection: direction,
    flex: 1,
    margin: raised ? "12px" : "0px",
    whiteSpace: "nowrap",
    flexGrow: grow,
    borderRadius: "8px",
    boxShadow: raised ? "rgba(0, 0, 0, 0.2) 0px 2px 6px 0px" : null,
  }
  
  return (
    <>
      <div style={style}>
        {children}
      </div>
    </>
  )
}