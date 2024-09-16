import React, { useCallback, useState } from 'react';
import { TextInput, View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import service from '../appwrite/config';
import { useSelector, useDispatch } from 'react-redux';
import { getData } from '../../store/getDataSlice';
import { Query } from 'appwrite';
import Snackbar from 'react-native-snackbar';
import {responsiveFontSize} from 'react-native-responsive-dimensions'


const validationSchema = Yup.object().shape({
    documents: Yup.array().of(
        Yup.object().shape({
            Item: Yup.string().required('Item is required'),
            Price: Yup.number().required('Price is required').typeError('Must be number'),
            Quantity: Yup.string().required('Quantity is required'),
        })
    ),
});

const AddItems = () => {
    const dispatch = useDispatch()
    const limit = useSelector((state) => state.data.queryLimit)
    const {width} = Dimensions.get('window')
    const [disabel, setDisabel] = useState(false)

    // refresh control
    const [refresh, setrefresh] = useState(false)

    const onRefresh = useCallback(() => {
    setrefresh(true)
    setTimeout(() => {
      setrefresh(false)
    },1000)
    },[])

    // initial data schema
    const date = new Date()
    const initialValues = {
        documents: [{ Item: '', Price: '', Date: date.toISOString(), Quantity: '', Category: '' }],
    };

    const handleSubmit = async(values, {resetForm}) => {
        setDisabel(true)
        const formattedValues = {
            documents: values.documents.map(doc => ({
                ...doc,
                Price: parseFloat(doc.Price),
            }))
        };

       const data = await service.createRationLists(formattedValues.documents)
       if (data) {
        setTimeout(() => {
            const data = async () => {
                await service.getRasanLists(Query.limit(limit) || 100)
                .then((res) => {
                    Snackbar.show({
                        text: 'Item Addedd SucessFull',
                        duration: Snackbar.LENGTH_SHORT,
                        textColor: 'white',
                        backgroundColor: 'green',
                    })
                    dispatch(getData(res.documents))
                    console.log(res);
                    resetForm()
                    setDisabel(false)
                })
                .catch((err) => {
                    Snackbar.show({
                        text: 'Error occur',
                        duration: Snackbar.LENGTH_SHORT,
                        textColor: 'white',
                        backgroundColor: 'red'
                    })
                    console.log(err);
                })
              }
              data()
           },1000)
       }
    };
    return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps='handled' refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh}/>}>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, handleChange, handleSubmit, errors, touched,resetForm }) => (
                <View>
                    <FieldArray name="documents">
                        {({ remove, push }) => (
                            <View>
                                {Array.isArray(values.documents) && values.documents.map((document, index) => (
                                    <View key={index} style={styles.formGroup}>

                                <View style={styles.verticalAlign}>
                                    <Text style={styles.verticalAlignText}>Item</Text>
                                    <View>
                                        <TextInput
                                            style={[styles.input,{width:width*0.5}]}
                                            placeholder="Item"
                                            placeholderTextColor={'gray'}
                                            onChangeText={handleChange(`documents.${index}.Item`)}
                                            value={document.Item}
                                        />
                                        {errors.documents?.[index]?.Item && touched.documents?.[index]?.Item && (
                                            <Text style={styles.error}>{errors.documents[index].Item}</Text>
                                        )}
                                    </View>
                                </View>

                                <View style={styles.verticalAlign}>
                                    <Text style={styles.verticalAlignText}>Price</Text>
                                    <View>
                                        <TextInput
                                            style={[styles.input,{width:width*0.5}]}
                                            placeholder="Price"
                                            placeholderTextColor={'gray'}
                                            onChangeText={handleChange(`documents.${index}.Price`)}
                                            value={document.Price}
                                            keyboardType="numeric"
                                        />
                                        {errors.documents?.[index]?.Price && touched.documents?.[index]?.Price && (
                                            <Text style={styles.error}>{errors.documents[index].Price}</Text>
                                        )}
                                    </View>
                                </View>

                                <View style={styles.verticalAlign}>
                                    <Text style={styles.verticalAlignText}>Date</Text>
                                    <TextInput
                                        style={[styles.input,{width:width*0.5, textAlign:'left'}]}
                                        placeholderTextColor={'gray'}
                                        placeholder="Date"
                                        onChangeText={handleChange(`documents.${index}.Date`)}
                                        value={new Date(document.Date).toDateString()}
                                        readOnly
                                    />
                                </View>

                                <View style={styles.verticalAlign}>
                                    <Text style={styles.verticalAlignText}>Quantity</Text>
                                    <View>
                                        <TextInput
                                            style={[styles.input,{width:width*0.5}]}
                                            placeholder="Quantity"
                                            placeholderTextColor={'gray'}
                                            onChangeText={handleChange(`documents.${index}.Quantity`)}
                                            value={document.Quantity}
                                        />
                                        {errors.documents?.[index]?.Quantity && touched.documents?.[index]?.Quantity && (
                                            <Text style={styles.error}>{errors.documents[index].Quantity}</Text>
                                        )}
                                    </View>
                                </View>

                                <View style={styles.verticalAlign}>
                                    <Text style={styles.verticalAlignText}>Category</Text>
                                    <TextInput
                                        style={[styles.input,{width:width*0.5}]}
                                        placeholder="Category"
                                        placeholderTextColor={'gray'}
                                        onChangeText={handleChange(`documents.${index}.Category`)}
                                        value={document.Category}
                                    />
                                </View>

                                <TouchableOpacity onPress={() => remove(index)} style={styles.removeButton}>
                                    <Text style={styles.buttonText}>Remove</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                        <TouchableOpacity onPress={() => push({ Item: '', Price: '', Date: date, Quantity: '', Category: '' })} style={styles.addButton}>
                            <Text style={styles.buttonText}>Add More Item</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </FieldArray>
            <TouchableOpacity disabled={disabel} onPress={handleSubmit} style={styles.submitButton}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            </View>
            )}
        </Formik>
    </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#0C0C0C',
    },
    formGroup: {
        marginBottom: 20,
        backgroundColor: '#2E073F',
        padding: 10,
        borderRadius: 10
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
        color: '#000',
    },
    verticalAlign: {
        flex:1, 
        flexDirection:'row', 
        alignItems: 'center', 
        justifyContent:'space-between',
    },
    verticalAlignText:{
        color: 'white', 
        fontSize:responsiveFontSize(2.1),
        maxWidth:90,
        width: '100%'
    },
    addButton: {
        backgroundColor: '#AD49E1',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginBottom: 20,
    },
    removeButton: {
        backgroundColor: '#dc3545',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginBottom: 10,
        marginTop: 15,
    },
    submitButton: {
        backgroundColor: '#28a745',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginBottom: 5,
    },
});

export default AddItems;
