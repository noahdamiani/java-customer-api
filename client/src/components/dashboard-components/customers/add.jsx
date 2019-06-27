import React from "react";
import {
	Card,
	CardBody,
	CardTitle,
	CardSubtitle,
	Col,
    Row,
    Button,
    Input,
    Label,
    FormGroup,
    Form,
    Alert
} from 'reactstrap';

class UserAdd extends React.Component {
    state = {
        addPaneHidden: true,
        fields: {
            firstName: "",
            lastName: "",
            email: "",
            company: "",
            age: ""
        },
        addedUser: null,
        errs: []
    }
    inputHandler = (e, key) => {
        const fields = {...this.state.fields, [key]: e.target.value};
        console.log(e.target.value, key, fields)
        this.setState({fields});
    }
    err = errs => {
        this.setState({errs});
    }
    addCustomer = () => {
        const fields = {...this.state.fields};
        let passed = true;
        const errs = [];

        for (let input in fields) {
            if (fields[input] === "") {
                errs.push(`${input} must not be empty!`);
                passed = false;
            }
        }
        
        if (!passed) {
            this.err(errs);
        } else {  
            fetch("http://localhost:4567/customers/add", {
                method: "POST",
                body: JSON.stringify(this.state.fields)
            }).then(() => {
                console.log(`added new user with details`, this.state.fields); 
                const { firstName, lastName } = this.state.fields;
                this.setState({addedUser: {firstName, lastName}});
                setTimeout(() => {
                    this.setState({addedUser: null, addPaneHidden: true});
                }, 5000);
            });
        }
    }

    showUserPane = () => {
        this.setState({addPaneHidden: false});
    }

	render = () => {
        const { fields, addedUser } = this.state;
        return (
            <div>
                {!this.state.addPaneHidden ? <Card>
                 { addedUser ? <Row className="add-user-errors">
                   <Col sm={12}><Alert color="success">{addedUser.firstName} {addedUser.lastName} was successfully enrolled.</Alert></Col>
                </Row> : ""}
                {this.state.errs.length > 0 ? (<Row className="add-user-errors">
                    {this.state.errs.map(err => <Col sm={12}><Alert key={err} color = "danger">{err}</Alert></Col>)}
                </Row>) : ""}
                <CardBody>
                    <div className="d-flex align-items-center">
                        <div>
                            <CardTitle>Add a new customer.</CardTitle>
                        </div>
                    </div>
                    <Row>
                        <Form className="UserEditor">
                            <FormGroup>
                                <Label for="firstName">First Name</Label>
                                <Input required id="firstName" onChange={(e) => this.inputHandler(e, "firstName")} value={fields.firstName || ''} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="lastName">Last Name</Label>
                                <Input id="lastName" onChange={(e) => this.inputHandler(e, "lastName")} value={fields.lastName || ''} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="email">Email</Label>
                                <Input id="email" onChange={(e) => this.inputHandler(e, "email")} value={fields.email || ''} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="company">Company</Label>
                                <Input id="company" onChange={(e) => this.inputHandler(e, "company")} value={fields.company || ''} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="age">Age</Label>
                                <Input id="age" onChange={(e) => this.inputHandler(e, "age")} value={fields.age} />
                            </FormGroup>
                        </Form>
                    </Row>
                </CardBody>

                <Button onClick={() => this.addCustomer()}>Save</Button>
            </Card> : <Button className="add-user" onClick={() => this.showUserPane()}><i className="fas fa-plus"></i> Add a Customer</Button>}
            </div>
        )
    }
}

export default UserAdd;