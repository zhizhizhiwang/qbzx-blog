//src/lib/file.tsx
class remoteFile {
    /*
     * 远程文件类
     * @
    */

    key: string;
    title: string;
    date: string;
    content: string;

    constructor(
        key: string,
    ) {
        this.key = key;
        this.date = new Date().toLocaleDateString();
        
    }
}