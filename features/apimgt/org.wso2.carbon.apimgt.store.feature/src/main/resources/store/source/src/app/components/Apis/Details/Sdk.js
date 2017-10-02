/*
 * Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import  React from 'react'

import Api from '../../../data/api';
import Button from 'material-ui/Button';
import Card, { CardActions, CardMedia } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import FileDownload from 'material-ui-icons/FileDownload';
import Grid from 'material-ui/Grid';
import InfoOutline from 'material-ui-icons/InfoOutline';
import JSFileDownload from 'js-file-download';
import Paper from 'material-ui/Paper';
import SubHeader from 'material-ui/List/ListSubheader';
import Typography from 'material-ui/Typography';

class Sdk extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sdkLanguages: null
        };
        this.api_uuid = this.props.match.params.api_uuid;
        this.getSdkForApi = this.getSdkForApi.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        const api = new Api();
        let promised_languages = api.getSdkLanguages();

        promised_languages.then(
            response => {
                this.setState({sdkLanguages : response.obj});
            }
        ).catch(
            error => {
                if (process.env.NODE_ENV !== "production") {
                    console.log(error);
                }
                let status = error.status;
                if (status === 404) {
                    this.setState({notFound: true});
                }
            }
        );
    }

    // Call the REST API to generate the SDK
    getSdkForApi(id, language) {
        const api =new Api();
        let promised_sdk = api.getSdk(id,language);

        promised_sdk.then(
            response => {
                const sdkZipName = response.headers['content-disposition'].match(/filename="(.+)"/)[1];
                const sdkZip = response.data;
                //Prompt to download zip file for the SDK
                JSFileDownload(sdkZip, sdkZipName);
            }
        ).catch(
            error => {
                if (process.env.NODE_ENV !== "production") {
                    console.log(error);
                }
                let status = error.status;
                if (status === 404) {
                    this.setState({notFound: true});
                }else if( status === 400){
                    this.setState({badRequest: true});
                }else if(status === 500){
                    this.setState({serverError: true});
                }
            }
        );
    }

    //Handle the click event of the download button
    handleClick = (event,item) =>{
        const apiId = this.api_uuid;
        const language = item;
        this.getSdkForApi(apiId,language);
    }

    render(){
        const language_list = this.state.sdkLanguages;

        return (
            language_list ?

                <Grid container style={{marginTop:"10px"}}>
                    <Grid item xs={12} sm={6} md={9} lg={9} xl={10}>
                        <Grid container justify="left" spacing="24">
                            {language_list.map((language, index) => (
                                <Grid key={index} item>
                                    <div style={{width:"auto", textAlign:"center"}}>
                                        <Card>
                                            <SubHeader>{language.toString().toUpperCase()}</SubHeader>
                                            <Divider/>
                                            <CardMedia
                                                title={language.toString().toUpperCase()}
                                            >
                                                <img alt={language} src={"/store/public/images/sdks/"+new String(language)+".svg"} style={{width:"100px",height:"100px",margin:"15px"}}/>
                                            </CardMedia>
                                            <CardActions>
                                                <Grid container justify="center">
                                                    <Button raised color="primary" onClick={event => this.handleClick(event,language)}>
                                                        <FileDownload/> Download
                                                    </Button>
                                                </Grid>
                                            </CardActions>
                                        </Card>
                                    </div>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
                :
                <Grid container style={{marginLeft: "10%",marginRight:"10%",width:"100%"}} align="center">
                    <Grid item xs={12} sm={6} md={9} lg={9} xl={10} >
                        <Paper>
                            <Typography>
                                <InfoOutline/>No languages are configured.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

        );
    }
}
export default Sdk