"use client";

import { MoreVerticalIcon, PlusCircleIcon, SendIcon } from "lucide-react";
import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Message, MessageContent, MessageFooter, MessageGroup } from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { conversations, getProductById } from "@/lib/mock/chatcommerce";

export default function CustomerChatPage() {
  const conversation = conversations[0];
  const product = conversation.productId ? getProductById(conversation.productId) : undefined;

  return (
    <main className="grid flex-1 overflow-hidden md:grid-cols-[320px_1fr]">
      <aside className="hidden border-r bg-[#06131f] md:block">
        <div className="flex h-20 items-center justify-between border-b px-5">
          <h1 className="font-heading text-2xl font-bold uppercase">Active uplinks</h1>
          <Button variant="ghost" size="icon-sm" aria-label="New message">
            <PlusCircleIcon />
          </Button>
        </div>
        <button className="flex w-full gap-4 border-l-4 border-primary bg-primary/10 p-5 text-left shadow-[inset_0_0_18px_rgb(0_231_242/0.08)]" type="button">
          <Avatar className="size-12 rounded-none border border-primary">
            <AvatarImage src="/window.svg" />
            <AvatarFallback>DV</AvatarFallback>
          </Avatar>
          <span className="min-w-0 flex-1">
            <span className="flex justify-between gap-4 font-heading font-semibold uppercase">
              DplugVIP Business <span className="text-sm font-normal text-muted-foreground">Now</span>
            </span>
            <span className="block truncate font-mono text-xs text-muted-foreground">Yes, the M3 Max is in stock.</span>
          </span>
        </button>
      </aside>
      <section className="flex min-h-0 flex-col">
        <header className="flex h-20 items-center gap-4 border-b px-4 md:px-6">
          <Avatar className="size-12 rounded-none border border-primary">
            <AvatarImage src="/window.svg" />
            <AvatarFallback>DV</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-heading text-2xl font-bold uppercase text-primary">DplugVIP operator</h2>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              <span className="mr-2 inline-block size-2 bg-secondary" />
              Connection secure // PRX-92A
            </p>
          </div>
          <Button variant="ghost" size="icon-sm" aria-label="Conversation options">
            <MoreVerticalIcon />
          </Button>
        </header>
        <MessageScrollerProvider>
          <MessageScroller className="hud-grid flex-1 bg-muted/20">
            <MessageScrollerViewport>
              <MessageScrollerContent className="gap-7 px-4 py-8 md:px-10">
                <MessageScrollerItem className="flex justify-center">
                  <div className="border border-border bg-background px-4 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Transmission log // Today</div>
                </MessageScrollerItem>
                {product ? (
                  <MessageScrollerItem>
                    <div className="gui-panel mx-auto flex w-full max-w-xl gap-4 border bg-card p-3">
                      <span className="relative size-20 shrink-0 overflow-hidden border">
                        <Image
                          src={product.images[0].src}
                          alt={product.images[0].alt}
                          fill
                          sizes="80px"
                          className="image-tech object-cover"
                        />
                      </span>
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] uppercase text-muted-foreground">Attached asset</p>
                        <p className="truncate font-heading font-semibold uppercase">{product.title}</p>
                        <p className="font-mono font-bold text-primary">${product.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </MessageScrollerItem>
                ) : null}
                <MessageGroup>
                  {conversation.messages.map((message) => {
                    const fromCustomer = message.sender === "customer";

                    return (
                      <MessageScrollerItem key={message.id} scrollAnchor={message.id === conversation.messages.at(-1)?.id}>
                        <Message align={fromCustomer ? "end" : "start"}>
                          <MessageContent>
                            <Bubble align={fromCustomer ? "end" : "start"} variant={fromCustomer ? "tinted" : "default"}>
                              <BubbleContent>{message.body}</BubbleContent>
                            </Bubble>
                            <MessageFooter>{message.timestamp}</MessageFooter>
                          </MessageContent>
                        </Message>
                      </MessageScrollerItem>
                    );
                  })}
                </MessageGroup>
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
        <footer className="border-t bg-[#06131f] p-4 md:p-6">
          <InputGroup className="h-14 rounded-none bg-background font-mono text-xs">
            <InputGroupAddon>
              <PlusCircleIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder="ENTER TRANSMISSION..." />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-sm" className="rounded-none bg-primary text-primary-foreground" aria-label="Send message">
                <SendIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">AES-256 channel // End-to-end encrypted</p>
        </footer>
      </section>
    </main>
  );
}
