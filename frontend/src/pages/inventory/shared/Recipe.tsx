import { useState, useEffect } from 'react';
import { Menu, MenuItem, Chip } from '@material-ui/core';
import { v4 as uuid } from 'uuid';

import './Recipe.scss';

interface Ingredient {
  id: number;
  uuid: string;
  name: string;
}

interface Materials {
  name: string;
  id: number;
  type: string;
}

export default function Recipe() {
  // Fetching materials from backend stuff
  const [materials, setMaterials] = useState<Materials[]>([]);

  const getMaterials = async () => {
    const response = await fetch('http://localhost:5000/good', {
      headers: { Authorization: `bearer ${localStorage.token}` }
    });
    const data = await response.json();
    const items = data.message as Materials[];
    const materials = items.filter(item => item.type === 'raw' || item.type === 'semi-finished');
    setMaterials(materials);
  };

  useEffect(() => {
    getMaterials();
  }, []);

  // Form stuff
  const [recipe, setRecipe] = useState<Ingredient[]>([]);

  const addIngredient = (material: any) => {
    const { name, id } = material;
    setRecipe([...recipe, { name: name, id: id, uuid: uuid() }]);
    handleClose();
  };

  const removeIngredient = (uuid: string) => {
    setRecipe(recipe.filter(ingredient => ingredient.uuid !== uuid));
  };

  // Material Menu Stuff
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement | HTMLLabelElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="Recipe">
      <label onClick={handleClick}>Recipe</label>
      <div role="button" className="recipe-input" tabIndex={0} onClick={handleClick}>
        {recipe.map(ingredient => (
          <Chip
            key={ingredient.uuid}
            label={ingredient.name}
            onDelete={() => removeIngredient(ingredient.uuid)}
          />
        ))}
      </div>

      {recipe.map(ingredient => (
        <input name="ingredient" key={ingredient.uuid} type="hidden" value={ingredient.id} />
      ))}

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        {materials.map(material => (
          <MenuItem key={material.id} onClick={() => addIngredient(material)}>
            {material.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
