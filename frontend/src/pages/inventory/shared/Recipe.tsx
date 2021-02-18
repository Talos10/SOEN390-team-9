import { useState } from 'react';
import { Menu, MenuItem, Chip } from '@material-ui/core';
import { v4 as uuid } from 'uuid';

import './Recipe.scss';

interface Ingredient {
  id: number,
  uuid: string,
  name: string
}

export default function Recipe() {
  // Replace with backend logic
  const materials = [
    { name: "Odyssey 1999 Brake", id: 1 },
    { name: "Izumi ECO Chain 1/8\" Black", id: 2 },
    { name: 'EAI Deluxe Steel Cog 1/8"', id: 3 },
    { name: '2019 SL 1.1 Carbon Road Frame', id: 4 },
    { name: 'All-City Gonzo Perforated Leather Saddle', id: 5 }
  ];

  const [recipe, setRecipe] = useState<Ingredient[]>([]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement | HTMLLabelElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const addIngredient = (material: any) => {
    const { name, id } = material;
    setRecipe([...recipe, { name: name, id: id, uuid: uuid() }]);
    handleClose();
  }

  const removeIngredient = (uuid: string) => {
    setRecipe(recipe.filter(ingredient => ingredient.uuid !== uuid));
  }

  return (
    <div className="Recipe">
      <label onClick={handleClick}>Recipe</label>
      <div role="button" className="recipe-input" tabIndex={0} onClick={handleClick}>
        {recipe.map(ingredient =>
          <Chip key={ingredient.uuid} label={ingredient.name} onDelete={() => removeIngredient(ingredient.uuid)} />
        )}
      </div>

      {recipe.map(ingredient =>
        <input name="ingredient" key={ingredient.uuid} type="hidden" value={ingredient.id} />
      )}

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose} >
        {
          materials.map(material =>
            <MenuItem key={material.id} onClick={() => addIngredient(material)}>{material.name}</MenuItem>
          )
        }
      </Menu>
    </div>
  );
}

