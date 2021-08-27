import React, { Component } from "react";
import { StyleSheet, View } from "react-native";

function Index(props) {
  return (
    <View style={styles.container}>
      <View style={styles.divider}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 276,
    height: 1
  },
  divider: {
    width: 276,
    height: 1
  }
});

export default Index;
