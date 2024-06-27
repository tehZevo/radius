import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';

import {useDropzone} from 'react-dropzone'

import * as radius from "../services/radius"
import Box from "../components/box"
import {fileToBase64} from "../utils/fileUtils"

const WORDS = ["fun", "awesome", "cool", "neat", "inspiring", "controversial", "interesting", "contentious"]

function FileDropzone({addFiles})
{
  const onDrop = async files =>
  {
    files = Array.from(files)
    
    //create entries of (name, data)
    files = await Promise.all(files.map(async (f) =>
    {
      return {
        name: f.name,
        data: await fileToBase64(f)
      }
    }))
    
    addFiles(files)
  }
  
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <Box>
      <div style={{width: "200px", height: "50px", cursor: "pointer"}} {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop files here...</p> :
            <p>+ Add files</p>
        }
      </div>
    </Box>
  )
}

function File({file, remove})
{
  return (
    <Box>{file.name}<button onClick={remove}>X</button></Box>
  )
}

export default function CreatePost()
{
  const navigate = useNavigate()
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
    //TODO: return post cid and then navigate to single post
    //TODO: this would likely require storing author data on the post.. which means the author has to sign posts
    //TODO: reenable file uploading
    const postId = await radius.createPost(content, files)
    
    const userId = await radius.getUserId()
    navigate("/profile/" + userId)
  }
  
  return (
    <Box>
      <form onSubmit={onSubmit}>
        <p>Write something {word}...</p>
        <input name="content" type="text" required />
        <button type="submit">Post</button>
        <FileDropzone addFiles={addFiles} />
      </form>
      <Box direction="column" raised={false}>
        {files.map((e, i) => <File file={e} remove={() => removeFile(i)} />)}
      </Box>
    </Box>
  )
}