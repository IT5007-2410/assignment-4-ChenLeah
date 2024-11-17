import React, {useState} from 'react';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    Button,
    useColorScheme,
    View,
    Alert,
    TouchableOpacity,
  } from 'react-native';

  const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

  function jsonDateReviver(key, value) {
    if (dateRegex.test(value)) return new Date(value);
    return value;
  }

  async function graphQLFetch(query, variables = {}) {
    try {
        /****** Q4: Start Coding here. State the correct IP/port******/
        const response = await fetch('http://10.0.2.2:3000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ query, variables })
        /****** Q4: Code Ends here******/
      });
      const body = await response.text();
      const result = JSON.parse(body, jsonDateReviver);

      if (result.errors) {
        const error = result.errors[0];
        if (error.extensions.code == 'BAD_USER_INPUT') {
          const details = error.extensions.exception.errors.join('\n ');
          alert(`${error.message}:\n ${details}`);
        } else {
          alert(`${error.extensions.code}: ${error.message}`);
        }
      }
      return result.data;
    } catch (e) {
      alert(`Error in sending data to server: ${e.message}`);
    }
  }

class IssueFilter extends React.Component {
    render() {
      return (
        <View style={styles.block}>
        {/****** Q1: Start Coding here. ******/}
          <Text style={styles.blockTitle}>This is the place holder for IssueFilter</Text>
        {/****** Q1: Code ends here ******/}
        </View>
      );
    }
}

const theme = {
  colors: {
    primary: '#537791',
    background: '#f9f9f9',
    text: '#000',
    buttonText: '#fff',
  },
  fontSizes: {
    small: 14,
    medium: 16,
    large: 18,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  block: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  blockTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  header: {
    height: 50,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
  },
  headerText: {
    color: theme.colors.buttonText,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: theme.fontSizes.medium,
    paddingHorizontal: 8,
  },
  rowText: {
    textAlign: 'center',
    color: '#000',
    paddingHorizontal: 8,
    flexWrap: 'wrap', // Allow text to wrap
  },
  row: {
    height: 40,
    backgroundColor: '#E7E6E1',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#537791',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});



const width = [40, 80, 80, 80, 80, 80, 250];


function IssueRow(props) {
    const issue = props.issue;
    {/****** Q2: Coding Starts here. Create a row of data in a variable******/}
    const rowData=[
      issue.id,
      issue.status,
      issue.owner,
      issue.created.toDateString(),
      issue.effort,
      issue.due ? issue.due.toDateString(): '',
      issue.title
    ];
    {/****** Q2: Coding Ends here.******/}


    return (
      <>
      {/****** Q2: Start Coding here. Add Logic to render a row  ******/}
        <Row data={rowData} widthArr={width} style={styles.row} textStyle={styles.rowText}/>
      {/****** Q2: Coding Ends here. ******/}  
      </>
    );
  }
  
  function IssueTable(props) {
    const issues = props.issues || []
    const issueRows = issues.map(issue =>
      <IssueRow key={issue.id} issue={issue} />
    );

    {/****** Q2: Start Coding here. Add Logic to initalize table header  ******/}
    const tableHead = [
      'ID',
      'Status',
      'Owner',
      'Created',
      'Effort',
      'Due Date',
      'Title',
      'else'
    ];
    {/****** Q2: Coding Ends here. ******/}
    
    
    return (
    <>
    {/****** Q2: Start Coding here to render the table header/rows.**********/}
      <ScrollView horizontal={true} style={styles.container}>
        <ScrollView>
          <Table>
            <Row data={tableHead} widthArr={width} style={styles.header} textStyle={styles.headerText} />
            <TableWrapper style={styles.dataWrapper}>{issueRows}</TableWrapper>
          </Table>
        </ScrollView>
      </ScrollView>
    {/****** Q2: Coding Ends here. ******/}
    </>
    );
  }

  
  class IssueAdd extends React.Component {
    constructor() {
      super();
      this.handleSubmit = this.handleSubmit.bind(this);
      /****** Q3: Start Coding here. Create State to hold inputs******/
      this.state ={owner:'', title: ''}
      /****** Q3: Code Ends here. ******/
    }
  
    /****** Q3: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
    handleOwnerChange = (owner) => {
      this.setState({ owner });
    };
    
    handleTitleChange = (title) => {
      this.setState({ title });
    };
    /****** Q3: Code Ends here. ******/
    
    handleSubmit() {
      /****** Q3: Start Coding here. Create an issue from state variables and call createIssue. Also, clear input field in front-end******/
      const { owner, title } = this.state;

      const issue = {
        owner: owner,
        title: title,
        due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10),
      };

      this.props.createIssue(issue);
      this.setState({ owner: '', title: '' });
      /****** Q3: Code Ends here. ******/
    }
  
    render() {
      return (
          <View style={styles.block}>
          {/****** Q3: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
            <Text style={styles.blockTitle}>Add Issue</Text>
            <TextInput
              style={styles.input}
              placeholder="Owner"
              value={this.state.owner}
              onChangeText={this.handleOwnerChange}
            />
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={this.state.title}
              onChangeText={this.handleTitleChange}
            />
            <TouchableOpacity style={styles.button} onPress={this.handleSubmit}>
              <Text style={styles.buttonText}>Add Issue</Text>
            </TouchableOpacity>
          {/****** Q3: Code Ends here. ******/}
          </View>
      );
    }
  }


class BlackList extends React.Component {
    constructor()
    {   super();
        this.handleSubmit = this.handleSubmit.bind(this);
        /****** Q4: Start Coding here. Create State to hold inputs******/
        this.state={name: ''}
        /****** Q4: Code Ends here. ******/
    }
    /****** Q4: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
    handleBlacklistChange = (name) => {
        this.setState({ name });
    };
    /****** Q4: Code Ends here. ******/

    async handleSubmit() {
    /****** Q4: Start Coding here. Create an issue from state variables and issue a query. Also, clear input field in front-end******/
    const name = this.state.name;

    if (name === '') {
        alert('Please enter a name to blacklist');
        return;
    }
    else{
      console.log(name);
      this.props.blackList(name);
      Alert.alert('Name Blacklisted');
      this.setState({ name: '' });

    }
    /****** Q4: Code Ends here. ******/
    }

    render() {
    return (
        <View style={styles.block}>
        {/****** Q4: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
        <Text style={styles.blockTitle}>Blacklist</Text>
        <TextInput
          style={styles.input}
          placeholder="Name to be blacklisted"
          value={this.state.name}
          onChangeText={this.handleBlacklistChange}
        />
        <TouchableOpacity style={styles.button} onPress={this.handleSubmit}>
          <Text style={styles.buttonText}>Blacklist</Text>
        </TouchableOpacity>
        {/****** Q4: Code Ends here. ******/}
        </View>
    );
    }
}

export default class IssueList extends React.Component {
    constructor() {
        super();
        this.state = { issues: [] };
        this.createIssue = this.createIssue.bind(this);
        this.blackList = this.blackList.bind(this);
    }
    
    componentDidMount() {
    this.loadData();
    }

    async loadData() {
    const query = `query {
        issueList {
        id title status owner
        created effort due
        }
    }`;

    const data = await graphQLFetch(query);
    if (data) {
        this.setState({ issues: data.issueList });
    }
    }

    async createIssue(issue) {
    const query = `mutation issueAdd($issue: IssueInputs!) {
        issueAdd(issue: $issue) {
        id
        }
    }`;

    const data = await graphQLFetch(query, { issue });
    if (data) {
        this.loadData();
    }
    }

    async blackList(nameInput) {
      const query = `mutation addToBlacklist($nameInput: String!) {
        addToBlacklist(nameInput: $nameInput)
      }`;
    
      try {
        const response = await graphQLFetch(query, { nameInput });
        if (response) {
          console.log('Successfully blacklisted:', nameInput);
        } else {
          console.error('Failed to blacklist:', nameInput);
        }
      } catch (error) {
        console.error('Error blacklisting name:', error);
      }
    }
    
    
    render() {
    return (
    <ScrollView style= {styles.container}>
    {/****** Q1: Start Coding here. ******/}
    <IssueFilter/>
    {/****** Q1: Code ends here ******/}


    {/****** Q2: Start Coding here. ******/}
    <IssueTable issues={this.state.issues}/>
    {/****** Q2: Code ends here ******/}

    
    {/****** Q3: Start Coding here. ******/}
    <IssueAdd createIssue={this.createIssue}/>
    {/****** Q3: Code Ends here. ******/}

    {/****** Q4: Start Coding here. ******/}
    <BlackList blackList = {this.blackList}/>
    {/****** Q4: Code Ends here. ******/}
    </ScrollView>
      
    );
  }
}
