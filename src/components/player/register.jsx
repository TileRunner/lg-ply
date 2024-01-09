import { useState } from 'react';
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { callUpdatePlayer } from "../../callApi";

const Register =({leagueData, setLeagueData, loggedInPlayer, setLoggedInPlayer, setKey}) => {
    const [leagueIndex, setLeagueIndex] = useState("");
    const [leagueCode, setLeagueCode] = useState("");
    const handleSelectLeague = async (e) => {
        let leagueId = parseInt(e.target.value);
        for (let i = 0; i < leagueData.leagues.length; i++) {
            if (leagueData.leagues[i].id === leagueId) {
                setLeagueIndex(i);
                return;
            }
        }
        setLeagueIndex(-1);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (leagueIndex < 0) {
            alert("Please select a league.");
            return;
        }
        if (leagueData.leagues[leagueIndex].code !== leagueCode) {
            alert("Please enter the league code that the league manager provided.");
            return;
        }
        let newLeagueId = leagueData.leagues[leagueIndex].id;
        let newLeagueData = await callUpdatePlayer(loggedInPlayer.id, loggedInPlayer.userId, loggedInPlayer.nickname, newLeagueId);
        setLeagueData(newLeagueData); // Take it, good or bad!
        let foundPlayerIndex = -1;
        for (let i = 0; foundPlayerIndex < 0 && i < newLeagueData.players.length; i++) {
            if (newLeagueData.players[i].id === loggedInPlayer.id) {
                foundPlayerIndex = i;
            }
        }
        if (foundPlayerIndex < 0) {
            // Not a match on new user id after adding new user, something burped
            alert('Sorry, failed to register! Dang it.');
        } else {
            // Is a match on new user id after adding new user, accept it
            setLoggedInPlayer(newLeagueData.players[foundPlayerIndex]);
            setKey('home');
        }
    }
    return <Container fluid>
        <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} controlId='leagueSelection'>
                <Form.Label column sm={5}>Select League:</Form.Label>
                <Col sm='auto'>
                    <Form.Select onChange={handleSelectLeague}>
                        <option value={-1}>Select League</option>
                        {leagueData.leagues && leagueData.leagues.filter(l => l.status === 'Registration').map((l,i) =>
                            <option key={i} value={l.id}>{l.desc}</option>
                        )}
                    </Form.Select>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="leagueCode">
                <Form.Label column sm={5}>League Code:</Form.Label>
                <Col sm={5}>
                    <Form.Control
                        className="sm-1"
                        type="text"
                        value={leagueCode}
                        onChange={e => { setLeagueCode(e.target.value); } }
                        />
                </Col>
            </Form.Group>
            <Row>
                <Col xs='auto'>
                    <Button
                    variant='primary'
                    type='submit'
                    >
                        Submit
                    </Button>
                </Col>
            </Row>
        </Form>
    </Container>
}

export default Register;