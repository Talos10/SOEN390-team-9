import { Container } from "../../../components";
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';

//********* TODO: REFACTOR INLINE CSS *************
export default function AddEvent() {
    return (
        <Container>
            <form className="AddItem">
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
                <div style={{backgroundColor: "white", width: "840px", height: "300px", padding: "30px"}}>
                    <FormControl variant="outlined" style={{width: "800px", margin: "20px"}}>
                        <InputLabel htmlFor="component-outlined">Date</InputLabel>
                            <OutlinedInput id="component-outlined" label="Date" />
                    </FormControl>
                    <FormControl variant="outlined" style={{width: "800px", margin: "20px"}}>
                        <InputLabel htmlFor="component-outlined">Time</InputLabel>
                            <OutlinedInput id="component-outlined" label="Time" />
                    </FormControl>
                    <FormControl variant="outlined" style={{width: "800px", margin: "20px"}}>
                        <InputLabel htmlFor="component-outlined">Title</InputLabel>
                            <OutlinedInput id="component-outlined" label="Title" />
                    </FormControl>
                </div>
                <div className="bottom">
                    <Button type="submit" color="primary" variant="contained">
                        Save
                    </Button>
                </div>
            </form>
        </Container>
    );
}