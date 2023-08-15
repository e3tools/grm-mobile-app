import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, StatusBar, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ToggleButton } from 'react-native-paper';
import { colors } from '../../../../utils/colors';
import i18n from 'i18n-js';
import ListHeader from '../components/ListHeader';
import moment from 'moment';

function Content({ issues, eadl, statuses }) {
  const navigation = useNavigation();
  const [selectedId, setSelectedId] = useState(null);
  const [status, setStatus] = useState('reported');
  const [_issues, setIssues] = useState([]);
  const [currentDate, setCurrentDate] = useState(moment());

  const sortByCreationDateDesc = (data) => {
    return data.sort(function(a,b){
      return new Date(b.created_date) - new Date(a.created_date);
    });
  };

  useEffect(() => {
    setIssues(issues);
  }, []);

  useEffect(() => {
    let filteredIssues = [];
    let foundStatus;
    switch (status) {
      case 'assigned':
        filteredIssues = issues.filter((issue) => issue.assignee && issue.assignee.id === eadl._id);
        filteredIssues = sortByCreationDateDesc(filteredIssues);
        break;
      case 'reported':
        filteredIssues = issues.filter((issue) => (issue.reporter && issue.reporter.id === eadl._id));
        filteredIssues = sortByCreationDateDesc(filteredIssues);
        break;
      case 'resolved':
        foundStatus = statuses.find((el) => el.final_status === true);
        filteredIssues = issues.filter((issue) => issue.assignee && issue.assignee.id === eadl._id && issue.status.id === foundStatus.id);
        filteredIssues = sortByCreationDateDesc(filteredIssues);
        break;
      default:
        filteredIssues = _issues.map((issue) => issue);
    }
    setIssues(filteredIssues);
  }, [status]);

  function Item({ item, onPress, backgroundColor, textColor }) {
    return (
      <TouchableOpacity onPress={onPress} style={[styles.item]}>
        <View style={styles.itemContainer}>
          <View>
            <Text style={[styles.title]}>{item.issue_type?.name} - {i18n.t('label_reference')} {item.tracking_code}</Text>
            <Text style={[styles.subTitle]} numberOfLines={1}>{item.title ? item.title : item.description}</Text>
            <Text style={[styles.subTitle]}>
              {item.citizen}, {item.intake_date && moment(item.intake_date).format('DD-MMM-YYYY')},{' '}
              {item.intake_date && currentDate.diff(item.intake_date, 'days')} {i18n.t('days_ago')}
            </Text>
            <Text style={styles.subTitle}>
              {i18n.t('status_label')}: <Text style={{ color: ((item.status?.id === 1 || item.status?.id === 2) ? colors.inProgress : colors.primary) }}>{item.status?.name}</Text>
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right-circle" size={24} color={colors.primary} />
        </View>
        {/* <Text style={[styles.title]}>{item.description}</Text> */}
      </TouchableOpacity>
    );
  }

  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';
    const color = item.id === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() =>
          navigation.navigate('IssueDetailTabs', {
            item,
            merge: true,
          })
        }
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  };

  const renderHeader = () => (
    <ListHeader status={status} />
  );
  return (
    <>
      <ToggleButton.Row
        style={{ justifyContent: 'space-between', padding: 10 }}
        onValueChange={(value) => {
          if (value) {
            setStatus(value)
          }
        }}
        value={status}
      >
        <ToggleButton
          style={{
            flex: 1,
            backgroundColor: (status === 'reported' ? colors.disabled : colors.white),
            borderBottomColor: status === 'reported' ? colors.primary : colors.white,
            borderBottomWidth: 3
          }}
          icon={() => (
            <View>
              <Text style={{
                color: status === 'reported' ? colors.primary : colors.secondary,
                fontWeight: status === 'reported' ? 'bold' : 'normal',
              }}>
                {i18n.t('reported')}
              </Text>
            </View>
          )}
          value="reported"
        />
        <ToggleButton
          style={{
            flex: 1,
            backgroundColor: (status === 'assigned' ? colors.disabled : colors.white),
            borderBottomColor: status === 'assigned' ? colors.primary : colors.white,
            borderBottomWidth: 3
          }}
          icon={() => (
            <View>
              <Text style={{
                color: status === 'assigned' ? colors.primary : colors.secondary,
                fontWeight: status === 'assigned' ? 'bold' : 'normal',
              }}>
                {i18n.t('assigned')}
              </Text>
            </View>
          )}
          value="assigned"
        />
        <ToggleButton
          style={{
            flex: 1,
            backgroundColor: (status === 'resolved' ? colors.disabled : colors.white),
            borderBottomColor: status === 'resolved' ? colors.primary : colors.white,
            borderBottomWidth: 3
          }}
          icon={() => (
            <View>
              <Text style={{
                color: status === 'resolved' ? colors.primary : colors.secondary,
                fontWeight: status === 'resolved' ? 'bold' : 'normal',
              }}>
                {i18n.t('resolved')}
              </Text>
            </View>
          )}
          value="resolved"
        />
      </ToggleButton.Row>
      <FlatList
        style={{ flex: 1 }}
        data={_issues}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        keyExtractor={(item) => item._id}
        extraData={selectedId}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    padding: 20,
    paddingBottom: 5,
    marginVertical: 8,
    marginHorizontal: 5,
    borderBottomWidth: 1,
    borderColor: colors.lightgray,
  },
  title: {
    fontFamily: 'Poppins_400Regular',
    // fontSize: 12,
    fontWeight: 'bold',
    fontStyle: 'normal',
    // lineHeight: 10,
    letterSpacing: 0,
    // textAlign: "left",
    color: '#707070',
  },
  subTitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    // textAlign: "left",
    // color: '#707070',
  },
  statisticsText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 11,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#707070',
  },
});

export default Content;
