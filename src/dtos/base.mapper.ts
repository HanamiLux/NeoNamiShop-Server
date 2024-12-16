export class BaseMapper<Entity, Dto> {
  constructor(private dtoType: new () => Dto) {}

  toDto(entity: Entity): Dto {
    const dto = new this.dtoType();
    Object.assign(dto, entity);
    return dto;
  }
}
