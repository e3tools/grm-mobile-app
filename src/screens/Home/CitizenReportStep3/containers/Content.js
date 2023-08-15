import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Dialog, IconButton, Paragraph, Portal } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import moment from 'moment';
import i18n from 'i18n-js';
import { LocalGRMDatabase } from '../../../../utils/databaseManager';
import { colors } from '../../../../utils/colors';
import { styles } from './Content.styles';

const SAMPLE_WORDS = ['car', 'house', 'tree', 'ball'];
const theme = {
  roundness: 12,
  colors: {
    ...colors,
    background: 'white',
    placeholder: '#dedede',
    text: '#707070',
  },
};

function Content({ issue, eadl }) {
  const navigation = useNavigation();
  const [showDialog, setShowDialog] = useState(false);

  const _hideDialog = () => setShowDialog(false);
  const _showDialog = () => setShowDialog(true);
  // const incrementId = () => {
  //   const last = eadl.bp_projects[eadl.bp_projects.length - 1];
  //   if (!eadl.bp_projects[0]) return 1;
  //   return parseInt(last.id.split('-')[1]) + 1;
  // };
  const randomWord = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const submitIssue = () => {
    const isAssignee =
      issue.category?.assigned_department === eadl?.department &&
      issue.category?.administrative_level === eadl?.administrative_level;
    // submit params
    const randomCodeNumber = Math.floor(Math.random() * 1000);
    // const newId = incrementId();
    const _issue = {
      internal_code: '',
      tracking_code: `${randomWord(SAMPLE_WORDS)}${randomCodeNumber}`,
      auto_increment_id: '',
      title: issue.issueSummary,
      description: issue.additionalDetails,
      attachments: [
        ...(issue?.attachment ? [issue.attachment] : []),
        ...(issue?.recording ? [issue.recording] : []),
      ],
      status: {
        name: i18n.t('open'),
        id: 2,
      },
      confirmed: true,
      assignee: isAssignee ? { id: eadl._id, name: eadl.representative?.name } : '',
      reporter: {
        id: eadl._id,
        name: eadl.representative.name,
      },
      citizen_age_group: issue.ageGroup,
      citizen: issue.name ?? '',
      contact_medium: issue.typeOfPerson,
      citizen_type: issue.citizen_type,
      citizen_group_1: issue.citizen_group_1,
      citizen_group_2: issue.citizen_group_2,
      location_info: {
        issue_location: issue.issueLocation,
        location_description: issue.locationDescription,
      },
      administrative_region: issue.issueLocation,
      // category: {
      //   id: 1,
      //   name: "Environmental",
      //   confidentiality_level: "Confidential",
      // },
      category: issue.category,
      issue_type: issue.issueType,
      issue_sub_type: issue.issueSubType,
      component: issue.issueComponent,
      sub_component: issue.issueSubComponent,
      //   type: {
      //   id: 1,
      //   name: "Complaint",
      // },
      created_date: new Date(),
      resolution_days: 0,
      resolution_date: '',
      intake_date: new Date(),
      issue_date: issue.date,
      ongoing_issue: issue.ongoingEvent,
      comments: [],
      contact_information: {
        type: issue.methodOfContact,
        contact: issue.contactInfo,
      },
      commune: {
        code: eadl.commune,
        name: eadl.name,
        prefecture: '',
      },
      type: 'issue',
    };
    createIssue(_issue);
    // navigation.navigate("CitizenReportStep4");
  };

  const createIssue = (_issue) => {
    LocalGRMDatabase.post(_issue)
      .then((response) => {
        navigation.navigate('CitizenReportStep4', { issue: _issue });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);
  return (
    <ScrollView>
      <View style={{ padding: 23 }}>
        <Text style={styles.stepText}>{i18n.t('step_5')}</Text>
        <Text style={styles.stepSubtitle}>{i18n.t('step_3_confirmation')}</Text>
        <Text style={styles.stepDescription}>{i18n.t('step_3_subtitle')}</Text>
      </View>


      {/* STEP 3 SUMMARY */}
      <View style={styles.cardConfirm}>
        {/*
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.stepLittleText}>{i18n.t('step_3')}</Text>
          <IconButton icon={'pencil'} size={26} color={colors.primary}/>
        </View>
        */}
        <View>
          <Text style={styles.stepSubtitle}>{i18n.t('step_3_field_title_1')}</Text>
          <Text style={styles.stepDescription}>
            {issue.date !== 'null' && !!issue.date ? moment(issue.date).format('DD-MMMM-YYYY') : '--'}
          </Text>
        </View>

        <View>
          <Text style={styles.stepSubtitle}>{i18n.t('step_3_field_title_2')}</Text>
          <Text style={styles.stepDescription}>{issue.issueType.name ?? '--'}</Text>
        </View>

        <View>
          <Text style={styles.stepSubtitle}>{i18n.t('step_3_field_title_2_1')}</Text>
          <Text style={styles.stepDescription}>{issue.issueSubType?.name ?? '--'}</Text>
        </View>

        <View>
          <Text style={styles.stepSubtitle}>{i18n.t('step_3_field_title_3')}</Text>
          <Text style={styles.stepDescription}>{issue.category?.name ?? '--'}</Text>
        </View>

        <View>
          <Text style={styles.stepSubtitle}>{i18n.t('step_3_field_title_5')}</Text>
          <Text style={styles.stepDescription}>{issue.issueComponent?.name ?? '--'}</Text>
        </View>

        <View>
          <Text style={styles.stepSubtitle}>{i18n.t('step_3_field_title_6')}</Text>
          <Text style={styles.stepDescription}>{issue.issueSubComponent?.name ?? '--'}</Text>
        </View>

        <View>
          <Text style={styles.stepSubtitle}>{i18n.t('step_3_field_title_4')}</Text>
          <Text style={styles.stepDescription}>{issue.additionalDetails ?? '--'}</Text>
        </View>

        <Text style={styles.stepSubtitle}>{i18n.t('step_3_attachments')}</Text>
        {issue.attachment && (
          <Text style={styles.stepDescription}>
            Image: {JSON.stringify(issue?.attachment?.id) ?? '--'}
          </Text>
        )}
        {issue.recording && (
          <Text style={styles.stepDescription}>
            Audio: {JSON.stringify(issue?.recording?.id) ?? '--'}
          </Text>
        )}
      </View>
      <View style={{ paddingHorizontal: 50 }}>
        <Button
          theme={theme}
          style={{ alignSelf: 'center', margin: 24 }}
          labelStyle={{ color: 'white', fontFamily: 'Poppins_500Medium' }}
          mode="contained"
          onPress={() => {
              if (issue.category && issue.category.confidentiality_level === 'Confidential') {
                _showDialog();
                return;
              }
              submitIssue();
            }
          }
        >
          {i18n.t('submit_button_text')}
        </Button>
      </View>

      <Portal>
        <Dialog visible={showDialog} onDismiss={_hideDialog}>
          <Dialog.Title>{i18n.t('warning')}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              {i18n.t('confidential_complaint')}
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              theme={theme}
              style={{
                alignSelf: 'center',
                backgroundColor: '#E74C3C',
                paddingLeft: 15,
                paddingRight: 15,
              }}
              labelStyle={{ color: 'white', fontFamily: 'Poppins_500Medium' }}
              mode="contained"
              onPress={_hideDialog}
            >
              {i18n.t('no')}
            </Button>
            <Button
              theme={theme}
              style={{ alignSelf: 'center', margin: 24, paddingLeft: 15, paddingRight: 15 }}
              labelStyle={{ color: 'white', fontFamily: 'Poppins_500Medium' }}
              mode="contained"
              onPress={() => {
                _hideDialog();
                submitIssue();
              }}
            >
              {i18n.t('yes')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

export default Content;
