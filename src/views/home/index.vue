<template>
  <div class="home-model tcenter">
    <van-notice-bar
      text="Technology is the common soul of the people who developed it."
      left-icon="volume-o"
    />
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item>1</van-swipe-item>
      <van-swipe-item>2</van-swipe-item>
      <van-swipe-item>3</van-swipe-item>
      <van-swipe-item>4</van-swipe-item>
    </van-swipe>
    <van-divider />

    <SvgIcon name="moon"></SvgIcon>

    <van-divider />

    <van-button class="flex mt10" type="primary" @click="$router.push('/about')"
      >home,点击跳转about</van-button
    >
    <div class="flex flex_center single">
      store的count数据 <span class="ml20 f30 t2">{{ $store.state.moduleMain.count }}</span>
    </div>
    <van-button class="flex mt10" type="primary" @click="onClickAdd">add +</van-button>
    <van-button class="flex mt10" type="primary" @click="onClickSub">dec -</van-button>

    <MyFooter :active="0"></MyFooter>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MyFooter from "@/components/MyFooter.vue";
import SvgIcon from "@/components/SvgIcon.vue";
import websdk from "easemob-websdk";
let WebIM: any = {};
WebIM.config = {
  appKey: "easemob-demo#easeim",
  url:
    (window.location.protocol === "https:" ? "https:" : "http:") + "//im-api-v2-hsb.easemob.com/ws",
  apiUrl: (window.location.protocol === "https:" ? "https:" : "http:") + "//a1-hsb.easemob.com",
};
WebIM.conn = new websdk.connection({
  appKey: "easemob-demo#easeim",
  url:
    (window.location.protocol === "https:" ? "https:" : "http:") + "//im-api-v2-hsb.easemob.com/ws",
  apiUrl: (window.location.protocol === "https:" ? "https:" : "http:") + "//a1-hsb.easemob.com",
});

WebIM.config.restServer =
  (window.location.protocol === "https:" ? "https:" : "http:") + "//a1-hsb.easemob.com";

@Component({
  name: "Home",
  components: { MyFooter, SvgIcon },
})
export default class Home extends Vue {
  private signToShow: Boolean = false; //
  private num: number = 0;
  private active: number = 0;
  private activeTab: number = 0;

  created() {}

  mounted() {
    this.num = this.$store.state.moduleMain.count;

    this.login();
    setTimeout(this.sendPrivateText, 2000);

    setTimeout(this.getRosterList, 3000);

    WebIM.conn.listen({
      onError(error) {
        console.log("onError", error);
      },
      onTextMessage(message) {
        console.log("message", message);
      },
      onContactAgreed: function (message) {
        console.log("onContactAgreed", message);
      }, // 好友请求被同意
      onContactInvited: function (message) {
        console.log("onContactInvited", message);
      }, // 收到好友邀请
      onContactDeleted: function (message) {
        console.log("onContactDeleted", message);
      }, // 被删除时回调此方法
      onContactAdded: function (message) {
        console.log("onContactAdded", message);
      }, // 增加了联系人时回调此方法
      onContactRefuse: function (message) {
        console.log("onContactRefuse", message);
      }, // 好友请求被拒绝
    });
  }

  onClickAdd() {
    this.$store.commit("moduleMain/increment");
  }

  onClickSub() {
    this.$store.commit("moduleMain/subtraction");
  }

  sendPrivateText() {
    let id = WebIM.conn.getUniqueId(); // 生成本地消息id
    let msg = new websdk.message("txt", id); // 创建文本消息

    let message = "加个好友呗!";
    // WebIM.conn.addContact("ceshi", message);

    // WebIM.conn.acceptInvitation("ceshi");

    msg.set({
      msg: "message content", // 消息内容
      to: "zd1", // 接收消息对象（用户id）
      chatType: "singleChat", // 设置为单聊
      success: function (id, serverMsgId) {
        console.log("send private text Success 发送");
      },
      fail: function (e) {
        console.log("Send private text error");
      },
    });
    WebIM.conn.send(msg.body);
  }

  getRosterList() {
    WebIM.conn.getRoster().then((res) => {
      console.log("查询好友列表", res); // res.data > ['user1', 'user2']
    });
  }

  login() {
    var options = {
      user: "zd2",
      pwd: "1",
      appKey: "easemob-demo#easeim",
    };
    WebIM.conn.open(options);
  }
}
</script>

<style lang='less' scoped>
.home-model {
  width: 100%;
  height: 100vh;
  padding: 10px;
}

.my-swipe .van-swipe-item {
  font-size: 20px;
  line-height: 150px;
  color: #fff;
  text-align: center;
  background-color: #07c160;
}

.single {
  width: 100%;
  height: 50px;
  margin-top: 20px;
}
</style>
















