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
    Form
} from 'reactstrap';


class UserEditor extends React.Component {
	render = () => {
        return (
            (!this.props.hidden) ? <Card>
                <CardBody>
                    <div className="d-flex align-items-center">
                        <div>
                            <CardTitle>Editing user {this.props.data.firstName} {this.props.data.lastName}</CardTitle>
                        </div>
                    </div>
                    <Row>
                        <Form className="UserEditor">
                            <FormGroup>
                                <Label for="firstName">First Name</Label>
                                <Input id="firstName" onChange={(e) => this.props.inputHandler(e, "firstName")} value={this.props.data.firstName || ''} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="lastName">Last Name</Label>
                                <Input id="lastName" onChange={(e) => this.props.inputHandler(e, "lastName")} value={this.props.data.lastName || ''} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="email">Email</Label>
                                <Input id="email" onChange={(e) => this.props.inputHandler(e, "email")} value={this.props.data.email || ''} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="company">Company</Label>
                                <Input id="company" onChange={(e) => this.props.inputHandler(e, "company")} value={this.props.data.company || ''} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="age">Age</Label>
                                <Input id="age" onChange={(e) => this.props.inputHandler(e, "age")} value={this.props.data.age} />
                            </FormGroup>
                        </Form>
                    </Row>
                </CardBody>

                <Button onClick={() => this.props.saveCustomer()}>Save</Button>
            </Card> : ""
        )
    }
}

export default UserEditor;