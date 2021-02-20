import { Container } from "../../../components";
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Event from '../shared/Event';

interface newEvent {
    title?: string,
    time?: string, // maybe change to time data type
    date?: string, // maybe change to date data type
}

export default function AddEvent() {
    const addEvent = (e: React.FormEvent) => {
        e.preventDefault();
        const data = parseEvent(e.target as HTMLFormElement);
        
        console.log(data);
    }

    const parseEvent = (form: HTMLFormElement): newEvent => {
        const data = new FormData(form);
         return{
             title: data.get("event-title") as string | undefined,
             date: data.get("event-date") as string | undefined,
             time: data.get("event-time") as string | undefined
         }
    }

    return (
        <Container>
            <form className="AddItem" onSubmit={addEvent}>
                <div className="top">
                    <h1 className="title">Add Event</h1>
                    <div className="top__buttons">
                        <Button variant="outlined" component={Link} to="/planning">
                            Discard
                        </Button>
                        <Button type="submit" color="primary" variant="contained">
                            Save
                        </Button>
                    </div>
                </div>
                <Event />
                <div className="bottom">
                    <Button type="submit" color="primary" variant="contained">
                        Save
                    </Button>
                </div>
            </form>
        </Container>
    );
}