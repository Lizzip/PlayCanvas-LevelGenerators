# Level Generators For PlayCanvas

## Getting Started

1. Add any of these scripts to a *Scripts 2.0* enabled PlayCanvas project
2. Attach the script to an Entity in the project
3. Ensure the required Entity Templates (and their parent entity) exist in the project

## Usage

1. The optional map parameters such as map width and height are set as script attributes, these can be modified in the editor
2. To create a new map `call createNew()`
3. To delete an existing map call `deleteOldMap()`

## Example

```javascript
var generator = this.app.root.findByName('Dungeon_Room_Gen').script.dungeonRoomGen;

generator.createNew();
generator.deleteOldMap();
```
