import { useState, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import {
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteChangeReason
} from '@material-ui/lab';
import { v4 as uuid } from 'uuid';
import { API_GOOD } from '../../../utils/api';
import './Recipe.scss';

interface Good {
  name: string;
  id: number;
  uuid: string;
  type?: string;
}

export default function Recipe() {
  const [goods, setGoods] = useState<Good[]>([]);
  const [recipe, setRecipe] = useState<Good[]>([]);

  const getGood = async () => {
    const response = await fetch(API_GOOD, {
      headers: { Authorization: `bearer ${localStorage.token}` }
    });
    const data = await response.json();
    const goods = (data.message as Good[])
      .filter(good => good.type === 'raw' || good.type === 'semi-finished')
      .map(good => ({ name: good.name, id: good.id, uuid: uuid() }));
    setGoods(goods);
  };

  const sortAlphabetically = (a: Good, b: Good) => {
    return a.name < b.name ? -1 : a.name === b.name ? 0 : 1;
  };

  const handleChange = (
    _: unknown,
    values: Good[],
    reason: AutocompleteChangeReason,
    details: AutocompleteChangeDetails<Good> | undefined
  ) => {
    if (!details) return;

    if (reason === 'select-option') {
      const { id, name, type } = details.option;
      setGoods([...goods, { id, name, type, uuid: uuid() }]);
      setRecipe(values);
    }

    if (reason === 'remove-option') {
      const uuid = details.option.uuid;
      const filteredGoods = goods.filter(good => good.uuid !== uuid);
      setGoods(filteredGoods);
      setRecipe(values);
    }
  };

  useEffect(() => {
    getGood();
  }, []);

  return (
    <div className="Recipe">
      <label htmlFor="recipe">Recipe</label>
      <Autocomplete
        className="Recipe__combobox"
        onChange={handleChange}
        multiple
        disableClearable={true}
        options={goods.sort(sortAlphabetically)}
        getOptionLabel={good => good.name}
        getOptionSelected={(good, ingredient) => good.uuid === ingredient.uuid}
        renderInput={params => (
          <TextField {...params} variant="outlined" id="recipe" type="text" />
        )}></Autocomplete>

      {recipe.map(ingredient => (
        <input key={ingredient.uuid} name="ingredient" type="hidden" value={ingredient.id} />
      ))}
    </div>
  );
}
