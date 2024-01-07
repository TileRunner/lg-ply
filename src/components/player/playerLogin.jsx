import {useState,useEffect} from 'react';
import {callAddPlayer} from '../../callApi';
import {Alert, Button, Container, Row, Col, Form, Dropdown, DropdownButton} from 'react-bootstrap';

const PlayerLogin=({setLoggedInPlayer, leagueData, setLeagueData}) => {
    const [newUserId, setNewUserId] = useState("");
    const [newNickname, setNewNickname] = useState("");
    const [sortedPlayers, setSortedPlayers] = useState([]);

    useEffect(() => {
        let newarray = [...leagueData.players];
        newarray.sort(function(a,b) {return a.nickname < b.nickname ? 1 : -1});
        setSortedPlayers(newarray);
    },[leagueData]);
    const handleSelectPlayer = (e) => {
        let newId = parseInt(e);
        for (let i = 0; i < leagueData.players.length; i++) {
            if (leagueData.players[i].id === newId) {
                setLoggedInPlayer(leagueData.players[i]);
            }
        }
    }

    const handleSubmitUser = async(event) => {
        event.preventDefault();
        if (!isValidFormat(newUserId)) {
            alert("Please enter a valid user id");
            return;
        }
        if (!isValidFormat(newNickname)) {
            alert("Please enter a valid nickname");
            return;
        }
        let foundPlayerIndex = -1;
        for (let i = 0; foundPlayerIndex < 0 && i < leagueData.players.length; i++) {
            if (leagueData.players[i].userId.toUpperCase() === newUserId.toUpperCase()) {
                alert(`User Id ${leagueData.players[i].userId} already exists (Nickname=${leagueData.players[i].nickname})`);
                return;
            }
            if (leagueData.players[i].nickname.toUpperCase() === newNickname.toUpperCase()) {
                alert(`Nickname ${leagueData.players[i].nickname} already exists (User Id=${leagueData.players[i].userId})`);
                return;
            }
        }
        let newLeagueData = await callAddPlayer(newUserId, newNickname, 0); // League assigned later
        setLeagueData(newLeagueData); // Take it, good or bad!
        foundPlayerIndex = -1;
        for (let i = 0; foundPlayerIndex < 0 && i < newLeagueData.players.length; i++) {
            if (newLeagueData.players[i].userId === newUserId) {
                foundPlayerIndex = i;
            }
        }
        if (foundPlayerIndex < 0) {
            // Not a match on new user id after adding new user, something burped
            alert('Sorry, failed to add user! Dang it.');
        } else {
            // Is a match on new user id after adding new user, accept it
            setLoggedInPlayer(newLeagueData.players[foundPlayerIndex]);
        }
    }
    function isValidFormat(s) {
        let alphanumericPattern = /^[ A-Za-z0-9]+$/;
        return alphanumericPattern.test(s);
    }
    return(<Container fluid>
        { leagueData.error && <Row><Col>
          <Alert variant='danger'>Error Encountered: {leagueData.errorMessage}</Alert>
          </Col></Row>
        }
        <Row>
            <Col sm='auto'>
                <Alert variant='info'>
                    <Alert.Heading>Select a player from the dropdown, or create a new user.</Alert.Heading>
                    <DropdownButton
                        title="Select:"
                        menuVariant='dark'
                        onSelect={handleSelectPlayer}>
                            {sortedPlayers.map((p,i) =>
                                <Dropdown.Item eventKey={p.id} key={i}>{p.nickname}</Dropdown.Item>
                            )}
                    </DropdownButton>
                </Alert>
            </Col>
        </Row>
        <Row>
            <Col sm='auto'>
                <Alert variant='primary'>
                    <Alert.Heading>Create a new user:</Alert.Heading>
                        <Form onSubmit={handleSubmitUser}>
                            <Form.Group controlId="userIdEntry">
                                <Row>
                                    <Col sm={4}>
                                        <Form.Label>User Id:</Form.Label>
                                    </Col>
                                    <Col sm={8}>
                                        <Form.Control
                                            className="sm-1"
                                            type="text"
                                            value={newUserId}
                                            onChange={e => { setNewUserId(e.target.value); } }
                                            isInvalid={newUserId && !isValidFormat(newUserId)} />
                                        <Form.Control.Feedback type="invalid">Must only use letters and/or numbers and/or spaces and/or dashes</Form.Control.Feedback>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={4}>
                                        <Form.Label>Nickname:</Form.Label>
                                    </Col>
                                    <Col sm={8}>
                                        <Form.Control
                                            className="sm-1"
                                            type="text"
                                            value={newNickname}
                                            onChange={e => { setNewNickname(e.target.value); } }
                                            isInvalid={newNickname && !isValidFormat(newNickname)} />
                                        <Form.Control.Feedback type="invalid">Must only use letters and/or numbers and/or spaces and/or dashes</Form.Control.Feedback>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Button type="submit">Submit</Button>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Form>
                </Alert>
            </Col>
        </Row>
    </Container>)
}

export default PlayerLogin;