import { Container } from "../../../components";
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Event from '../shared/Event';
import '../shared/AddForm.scss';

interface newEvent {
    title?: string,
    time?: string,
    date?: string,
}

export default function AddEvent() {
    const addEvent = (e: React.FormEvent) => {
        e.preventDefault();
        const data = parseEvent(e.target as HTMLFormElement);
        
        //TODO Sprint 3: Replace with backend logic
        console.log(data);
    }

    const parseEvent = (form: HTMLFormElement): newEvent => {
        const data = new FormData(form);
         return {
             title: data.get("event-title") as string | undefined,
             date: data.get("event-date") as string | undefined,
             time: data.get("event-time") as string | undefined
         }
    }

    return (
        <Container>
            <form className="AddForm" onSubmit={addEvent}>
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