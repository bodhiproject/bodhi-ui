/**
 * Created by leoliew on 2016/11/30.
 */
import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

const styles = {
  div: {
    margin: '1%'
  },
  card:{
    marginTop: '15px'
  }
};

export default class ShowCaseCard extends React.Component {

  render() {
    return (
        <Card style={styles.card}>
          <CardTitle title={this.props.title} subtitle={this.props.subtitle}/>
          <CardText>
            {this.props.text}
          </CardText>
        </Card>
    )
  }
};
