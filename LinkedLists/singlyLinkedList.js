class Node {
    constructor(data) {
        this.data = data;
        this.nextNode = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    getHead() {
        return this.head;
    }

    getSize() {
        return this.size;
    }

    isEmpty() {
        if (this.head == null)
            return true;
        else
            return false;
    }

    appendNode(data) {
        let newNode = new Node(data);
        
        if (this.isEmpty() == true) {
            this.head = newNode;
            this.size++;
        } else {
            let currentNode = this.head;
            while (currentNode.nextNode != null) {
                currentNode = currentNode.nextNode;
            }
            currentNode.nextNode = newNode;
            this.size++;
        }
    }

    printData(){
        if (this.isEmpty() == true) {
            console.log("List is Empty");
        } else {
            let currentNode = this.head;
            
            while (currentNode != null) {
                console.log(currentNode.data);
                currentNode = currentNode.nextNode;
            }
        }
    }
}

const studentID = new LinkedList();
// console.log(studentID.isEmpty());
studentID.appendNode(1);
studentID.appendNode(2);
studentID.appendNode(3);
studentID.appendNode(4);

studentID.printData();


