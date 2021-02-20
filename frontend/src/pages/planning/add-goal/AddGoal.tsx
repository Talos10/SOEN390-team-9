import { Container } from "../../../components";
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Goal from '../shared/Goal';

interface newGoal {
    title?: string,
    date?: string,
}

export default function AddGoal() {
    const addGoal = (e: React.FormEvent) => {
        e.preventDefault();
        const data = parseGoal(e.target as HTMLFormElement);
        
        console.log(data);
    }

    const parseGoal = (form: HTMLFormElement): newGoal => {
        const data = new FormData(form);
         return{
             title: data.get("goal-title") as string | undefined,
             date: data.get("goal-date") as string | undefined,
         }
    }


    return (
        <Container>
            <form className="AddItem" onSubmit={addGoal}>
                <div className="top">
                    <h1 className="title">Add Goal</h1>
                    <div className="top__buttons">
                        <Button variant="outlined" component={Link} to="/planning">
                            Discard
                        </Button>
                        <Button type="submit" color="primary" variant="contained">
                            Save
                        </Button>
                    </div>
                </div>
                <Goal />
                <div className="bottom">
                    <Button type="submit" color="primary" variant="contained">
                        Save
                    </Button>
                </div>
            </form>
        </Container>
    );
}