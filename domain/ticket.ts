export class Ticket{
    public name:string;
    public description:string;
    public id:string;

    constructor(row:any){
        this.description = row.description;
        this.name = row.title;
        this.id = row.id;
    }
}