function previewImage (event) {
  const fileElement = event.target
  const files = fileElement.files

  if (files.length) {
    for (const index in files) {
      const objectURL = URL.createObjectURL(files[index])
      fileElement.parentElement.children[0].src = objectURL
    }
  }
}
