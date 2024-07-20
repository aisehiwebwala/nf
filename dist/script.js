const handleSubmit = async(event)=>{
    event.preventDefault();
    const file = new FormData(event.target).get("phile");

    const chunkSize = 1024*1024;
    let start = 0;

    while(start < file.size){
        const nf = new FormData();
        nf.append("phile",file.slice(start,start+chunkSize));
        nf.append("file_info",JSON.stringify({is_first : start==0, is_last : start + chunkSize >= file.size, file_name:file.name}));
        start+=chunkSize;

        await fetch("/upload-file",{method:"POST",body:nf,"Content-Type":"multipart/form-data"});
    }
}