import { useState, useEffect } from "react"
import * as radius from "../../services/radius"
import Box from "../../components/box"
import {fileToBytes} from "../../utils/fileUtils"
import FileDropzone from "../FileDropzone"

const WORDS = ["fun", "awesome", "cool", "neat", "inspiring", "controversial", "interesting", "contentious", "wholesome", "thought-provoking"]

const Attachment = ({file, remove}) => <Box>{file.name}<button onClick={remove}>X</button></Box>

export default function CreatePost({onPost})
{
  const [word, setWord] = useState()
  const [files, setFiles] = useState([]);
  
  function addFiles(newFiles)
  {
    setFiles([...files, ...newFiles])
  }
  
  function removeFile(index)
  {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }
  
  useEffect(() =>
  {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)]
    setWord(word)
  }, [])
  
  async function onSubmit(e)
  {
    e.preventDefault()
    const formData = new FormData(e.target)
    const content = formData.get("content")
    const postId = await radius.createPost(content, files)
    
    onPost(postId)
  }

  const onDrop = async files =>
  {
    files = Array.from(files)
    
    //create entries of (name, data)
    files = await Promise.all(files.map(async (f) =>
    {
      return {
        name: f.name,
        data: await fileToBytes(f)
      }
    }))
    
    addFiles(files)
  }
  
  return (
    <Box raised={false}>
      <Box>
        <form onSubmit={onSubmit}>
          <p>Write something {word}...</p>
          <input name="content" type="text" required />
          <button type="submit">Post</button>
          <FileDropzone
            onDrop={onDrop}
            dragText="Drop files here..."
            defaultText="+ Add files"
          />
        </form>
      </Box>
      <Box direction="column" raised={false}>
        {files.map((e, i) => <Attachment file={e} remove={() => removeFile(i)} />)}
      </Box>
    </Box>
  )
}