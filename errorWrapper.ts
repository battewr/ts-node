export class RestfulError{
    public message:string;
    public status:number;
    constructor(message:string, status:number){
        this.status = status;
        this.message = message;
    } 

    public toString(){
        return this.message;
    }
}