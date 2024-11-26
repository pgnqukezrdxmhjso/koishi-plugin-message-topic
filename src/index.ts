import { Context, Schema } from "koishi";
// noinspection ES6UnusedImports
import {} from "koishi-plugin-message-topic-service";

export const name = "message-topic";

export const inject = ["messageTopicService"];

export interface Config {}

export const Config: Schema<Config> = Schema.object({});

export function apply(ctx: Context) {
  ctx
    .command("topic.register <topic:string>", {
      checkArgCount: true,
      authority: 2,
    })
    .action(async ({}, topic) => {
      await ctx.messageTopicService.registerTopic(topic);
      return "register success";
    });

  ctx.command("topic.info").action(async () => {
    const info = ctx.messageTopicService.registerTopicInfo();
    let msg = "";
    for (let key in info) {
      const item = info[key];
      msg += item.name + ": " + item.topics.join(", ") + "\n";
    }
    return msg || "no result";
  });

  ctx
    .command("topic.subscribe <bindingKey:string>", { checkArgCount: true })
    .action(async ({ session }, bindingKey) => {
      await ctx.messageTopicService.topicSubscribe({
        platform: session.bot.platform,
        selfId: session.bot.selfId,
        channelId: session.channelId,
        bindingKey: bindingKey,
        enable: true,
      });
      return "subscribe success";
    });

  ctx
    .command("topic.unsubscribe <bindingKey:string>", { checkArgCount: true })
    .action(async ({ session }, bindingKey) => {
      await ctx.messageTopicService.topicSubscribe({
        platform: session.bot.platform,
        selfId: session.bot.selfId,
        channelId: session.channelId,
        bindingKey: bindingKey,
        enable: false,
      });
      return "unsubscribe success";
    });

  ctx.command("topic.subscribe-list").action(async ({ session }) => {
    const rows = await ctx.messageTopicService.getTopicSubscribeByChannel(
      session.bot.platform,
      session.channelId,
    );
    return rows.map((row) => row.binding_key).join(", ") || "no result";
  });

  ctx
    .command("topic.topic-subscribe-list <topic:string>", {
      checkArgCount: true,
    })
    .action(async ({}, topic) => {
      const rows =
        await ctx.messageTopicService.getTopicSubscribeByTopic(topic);
      return rows.map((row) => row.binding_key).join(", ") || "no result";
    });

  ctx
    .command("topic.send <topic:string> <msg:text>", {
      checkArgCount: true,
      authority: 2,
    })
    .action(async ({}, topic, msg) => {
      await ctx.messageTopicService.sendMessageToTopic(topic, msg);
      return "send success";
    });
}
