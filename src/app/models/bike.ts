export class Bike {
    public bikeId!: string;
    public manufacturerId!: number;
    public model!: string;
    public frameSize!: number;
    public price!: number;

    public constructor(init?: Partial<Bike>) {
        Object.assign(this, init);
    }
}