import React, { Component } from 'react';
import { Footer, FooterTab, Button, Icon, Text } from 'native-base';

class DnaFooter extends Component {
    static propTypes = {
        activeKey: React.PropTypes.string
    }

    render() {
        const {activeKey} = this.props;
        return (
            <Footer>
                <FooterTab >
                    <Button active={activeKey === 'home' ? true : false} onPress={() => { global.route.home() }}>
                        <Icon name="apps" />
                        <Text style={{ color: '#ffffff' }}>书架</Text>
                    </Button>
                    <Button active={activeKey === 'search' ? true : false} onPress={() => { global.route.search() }}>
                        <Icon name="search" />
                        <Text style={{ color: '#ffffff' }}>搜索</Text>
                    </Button>
                    <Button active={activeKey === 'person' ? true : false} onPress={() => { }}>
                        <Icon name="person" />
                        <Text style={{ color: '#ffffff' }}>我</Text>
                    </Button>
                </FooterTab>
            </Footer>
        );
    }
}

export default DnaFooter;