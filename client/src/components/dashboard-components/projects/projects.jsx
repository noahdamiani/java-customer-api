import React from "react";

import img1 from 'assets/images/users/1.jpg';
import img2 from 'assets/images/users/2.jpg';
import img3 from 'assets/images/users/3.jpg';
import img4 from 'assets/images/users/4.jpg';

import moment from "moment";

import UserEditor from '../customers/editor';

import {
	Card,
	CardBody,
	CardTitle,
	CardSubtitle,
	Input,
	Table,
	Tooltip
} from 'reactstrap';

const API_ENDPOINT = 'http://localhost:4567';

class Projects extends React.Component {
	constructor(props) {
		super(props);

		this.toggle10 = this.toggle10.bind(this);
		this.toggle20 = this.toggle20.bind(this);
		this.toggle30 = this.toggle30.bind(this);
		this.toggle40 = this.toggle40.bind(this);
		this.state = {
			customers: [],
			editor: {
				hidden: true,
				data: {
					firstName: null,
					lastName: null,
					age: null,
					company: null
				},
				id: null
			},
			tooltipOpen10: false,
			tooltipOpen20: false,
			tooltipOpen30: false,
			tooltipOpen40: false
		};
	}

	toggle10() {
		this.setState({
			tooltipOpen10: !this.state.tooltipOpen10
		});
	}

	toggle20() {
		this.setState({
			tooltipOpen20: !this.state.tooltipOpen20
		});
	}

	toggle30() {
		this.setState({
			tooltipOpen30: !this.state.tooltipOpen30
		});
	}

	toggle40() {
		this.setState({
			tooltipOpen40: !this.state.tooltipOpen40
		});
	}

	componentDidMount = () => {
		/**
		 * Fetch list of users from the customers api.
		 */
		fetch(`${API_ENDPOINT}/customers`, { headers: { "Content-Type": "application/json; charset=utf-8" }})
			.then(res => res.json()) // parse response as JSON (can be res.text() for plain response)
			.then(customers => {
				this.setState({customers});
			})
			.catch(err => {
				console.log("Error fetching customer list", err);
			});
	}

	deleteCustomer = (id, index) => {
		fetch(`${API_ENDPOINT}/customers/delete/${id}`, {
			method: 'DELETE',
			headers: {'Content-Type': 'application/json'}
		}).then(() => {
			let customers = [...this.state.customers];
			let toRemove = customers[index];
			customers.splice(index, 1);
			this.setState({customers});
			console.log(`customer ${id} removed.`);
		});
	}

	editCustomer = (id, data, index) => {
		const editor = {...this.state.editor, id, data, hidden: false, index };
		this.setState({editor});
	}

	saveCustomer = () => {
		const editor = {...this.state.editor, hidden: true};
		fetch(`${API_ENDPOINT}/customers/update/${editor.id}`, {
			method: "PUT",
			body: JSON.stringify(editor.data)
		}).then(() => {
			// Hide Drawer & Update DOM
			let customers = [...this.state.customers];
			customers[editor.index] = { id: editor.id, data: editor.data };
			this.setState({editor, customers});
		});
	}

	updateInput = (e, key) => {
		const data = {...this.state.editor.data, [key]: e.target.value};
		const editor = {...this.state.editor, hidden: false, data};
        this.setState({editor});
    }

	render() {
		const { hidden, data, id } = this.state.editor;
		return (
			/*--------------------------------------------------------------------------------*/
			/* Used In Dashboard-4 [General]                                                  */
			/*--------------------------------------------------------------------------------*/
			<Card>
				<UserEditor hidden={hidden} data={data} id={data} saveCustomer={this.saveCustomer} inputHandler={this.updateInput} />
				<CardBody>
					<div className="d-flex align-items-center">
						<div>
							<CardTitle>Our special customers</CardTitle>
							<CardSubtitle>With us from the beginning</CardSubtitle>
						</div>
						<div className="ml-auto d-flex no-block align-items-center">
							<div className="dl">
								<Input type="select" className="custom-select">
									<option value="0">Monthly</option>
									<option value="1">Daily</option>
									<option value="2">Weekly</option>
									<option value="3">Yearly</option>
								</Input>
							</div>
						</div>
					</div>
					<Table className="no-wrap v-middle" responsive>
						<thead>
							<tr className="border-0">
								<th className="border-0">Name</th>
								<th className="border-0">Age</th>

								<th className="border-0">Company</th>
								<th className="border-0">Member Since</th>
								<th className="border-0">Edit</th>
							</tr>
						</thead>
						<tbody>
							{this.state.customers.map(({id, enrolledAt, data}, index) => 

								<tr key={id}>
									<td>
										<div className="d-flex no-block align-items-center">
											<div className="mr-2"><img src={data.img ? data.img : img1} alt="user" className="rounded-circle" width="45" /></div>
											<div className="">
												<h5 className="mb-0 font-16 font-medium">{data.firstName} {data.lastName}</h5><span>{data.email ? data.email : "n/a"}</span></div>
										</div>
									</td>
									<td>{data.age}</td>

									<td>
										{data.company}
									</td>
									<td>{data.enrolledAt ? moment(data.enrolledAt).format("MMMM Do YYYY") : "N/A"}</td>
									<td>
										<div onClick={() => this.editCustomer(id, data, index)}>edit</div>
										<div onClick={() => this.deleteCustomer(id, index)}>delete</div>
									</td>
								</tr>
							
							)}
							
						</tbody>
					</Table>
				</CardBody>
			</Card>
		);
	}
}

export default Projects;
